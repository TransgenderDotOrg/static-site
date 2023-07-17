import puppeteer from "puppeteer";
import fs from "fs";
import { uuid } from "uuidv4";
import { promisify } from "util";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import path from "path";
import languages from "../languages.json";

// Promisify fs methods for async/await usage
const writeFile = promisify(fs.writeFile);

const INPUT_DIR = path.join(__dirname, "../intake");

const model = new OpenAI({ modelName: "gpt-4" });
const template = `{content}

The above content was extracted from {url}. Convert the content into a JSON object. Here is the id of the content: {uuid}. Please wrap the output in triple backticks. Here is the JSON schema:

\`\`\`
{{
    id: string [required]
    title: string [required] (A short title for the resource)
    description: string [required] (A short description about what the resource is about and how it serves the transgender community)
    slug: string [required] [unique]
    externalUrl: Url
    tags: Tags{{ transmasculine, non-binary, transfeminine, legal, healthcare, mental-health, social-services, youth-services, support-groups, parent-family-resources, partner-resources, community-stories, education-awareness, financial-aid-scholarships, clothing, artists-creators, friendly-businesses, makeup, voice-training, discord-groups }}[]
    address: Address [optional, Google Maps friendly]
    phoneNumber: PhoneNumber [optional]
    country: Country [optional] (two letter country code)
    provinceOrState: ProvinceOrState [optional] (two letter province or state code)
    city: City [optional]
    county: County [optional]
    latLng: LatLng [optional] 
    email: Email [optional]
    socialMedia: {{ yelp: Url, google: Url, ... }} [optional]
}}
\`\`\``;
const translationPrompt = new PromptTemplate({
  template,
  inputVariables: ["url", "content", "uuid"],
});

// get the url from the command line
const url = process.argv[2];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // wait for the page to load
  await page.waitForSelector("body");

  // get the page text content
  // we need to strip css and other stuff from the page
  // so we only get the text
  // we will remove those elements from the page
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
      elements.forEach((e) => e.remove());
    });

    const textContent = document.querySelector("body")?.textContent;

    // now we need to remove unncecessary whitespace surrounding and in the text
    // we will use a regex to remove all whitespace
    // except for single spaces

    return textContent?.replace(/\s\s+/g, " ");
  });

  await browser.close();

  // now we need to translate the text content into JSON
  // we will use GPT-4 for this

  const id = uuid();

  const input = await translationPrompt.format({
    url,
    content: textContent,
    uuid: id,
  });

  const response = await model.call(input);

  // we need to extract the translated JSON from the response
  // we will use a regex to do this
  // it may have triple backticks around it, with or without json
  let translatedJson = response.match(/```(json)?([\s\S]*)```/)?.[2]?.trim();
  let translatedJsonObject: any;

  if (!translatedJson) {
    try {
      translatedJsonObject = JSON.parse(response.trim());
    } catch (err) {
      console.error(
        `Could not extract translated JSON from response: ${response}`
      );
    }
  } else {
    try {
      translatedJsonObject = JSON.parse(translatedJson);
    } catch (err) {
      console.error(
        `Could not extract translated JSON from response: ${response}`
      );
    }
  }

  // now we need to write the translated JSON to a file
  // we will use the id

  const fileName = `${id}.json`;

  await writeFile(
    path.join(INPUT_DIR, fileName),
    JSON.stringify(translatedJsonObject, null, 2)
  );

  console.log(`Wrote ${fileName} to ${INPUT_DIR}`);
})();
