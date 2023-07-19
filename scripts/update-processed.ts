import fs from "fs";
import { promisify } from "util";
import path from "path";
import { v4 } from "uuid";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { TokenTextSplitter } from "langchain/text_splitter";

(globalThis as any).fetch = fetch;

puppeteer.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Promisify fs methods for async/await usage
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const model = new OpenAI({ modelName: "gpt-4" });
const INPUT_DIR = path.join(__dirname, "../processed");

const template = `{content}

The above content was extracted from {url}. Update the tags and organization type for the resource. Here is the id of the resource: {uuid}. Please wrap the output in triple backticks. Use null when you cannot fill a field. Here is the JSON schema:

\`\`\`
{{
  id: string [required]
  tags: Tags{{ transmasculine, non-binary, transfeminine, legal, healthcare, mental-health, social-services, youth-services, support-groups, parent-family-resources, partner-resources, community-stories, education-awareness, financial-aid-scholarships, clothing, artists-creators, friendly-businesses, makeup, voice-training, discord-groups, spiritual, endocrinologists, surgeons, informed-consent-clinics }}[]
  organizationType: Tags{{ national-organization, local-office, community-center, online-platform, healthcare-provider, informed-consent-clinic, support-group, legal-service, educational-institution, non-profit-organization, government-entity, private-practice }}[]
}}
\`\`\``;

const updatePrompt = new PromptTemplate({
  template,
  inputVariables: ["url", "content", "uuid"],
});

async function processFiles() {
  const files = fs.readdirSync(INPUT_DIR);
  let index = 0;
  while (index < files.length) {
    const processingFiles = files.slice(index, index + 20);
    const processingPromises = processingFiles.map(processFile);
    await Promise.all(processingPromises);
    index += 20;
  }
}

async function processFile(fileName: string) {
  try {
    const fileContent = await readFile(path.join(INPUT_DIR, fileName), "utf8");
    const resource = JSON.parse(fileContent);

    const url = resource.externalUrl;
    const id = resource.id;
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve(true);
        } else {
          const readyStateCheckInterval = setInterval(() => {
            if (document.readyState === "complete") {
              clearInterval(readyStateCheckInterval);
              resolve(true);
            }
          }, 10);
        }
      });
    });

    const textContent = await page.evaluate(() => {
      const selectors = [
        "script",
        "style",
        "svg",
        "img",
        "iframe",
        "canvas",
        "video",
        "noscript",
      ];
      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        try {
          elements.forEach((e) => e.remove());
        } catch (err) {
          // do nothing
        }
      });
      const textContent = document.querySelector("body")?.textContent;
      return textContent?.replace(/\s\s+/g, " ");
    });

    const splitter = new TokenTextSplitter({
      encodingName: "gpt2",
      chunkSize: 7000,
      chunkOverlap: 0,
    });
    const output = await splitter.createDocuments([textContent ?? ""]);
    await browser.close();

    const input = await updatePrompt.format({
      url,
      content: output[0].pageContent,
      uuid: id,
    });
    const response = await model.call(input);

    let updatedData = response.match(/```(json)?([\s\S]*)```/)?.[2]?.trim();
    let updatedDataObject;

    if (!updatedData) {
      try {
        updatedDataObject = JSON.parse(response.trim());
      } catch (err) {
        console.error(
          `Could not extract translated JSON from response: ${response}`
        );
      }
    } else {
      try {
        updatedDataObject = JSON.parse(updatedData);
      } catch (err) {
        console.error(
          `Could not extract translated JSON from response: ${response}`
        );
      }
    }

    // Update tags and organization type
    resource.tags = updatedDataObject.tags;
    resource.organizationType = updatedDataObject.organizationType;

    await writeFile(
      path.join(INPUT_DIR, fileName),
      JSON.stringify(resource, null, 2)
    );
    console.log(`Updated ${fileName}`);
  } catch (error) {
    console.error(`Error processing file ${fileName}: ${error}`);
  }
}

processFiles();

export {};
