import fs from "fs";
import path from "path";
import { promisify } from "util";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import { fileURLToPath } from "url";
import languages from "../languages.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Promisify fs methods for async/await usage
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const INPUT_DIR = path.join(__dirname, "../intake");
const PROCESSED_DIR = path.join(__dirname, "../processed");
const OUTPUT_DIR = path.join(__dirname, "../resources");

const model = new OpenAI({ modelName: "gpt-4" });
const template = `Translate the following JSON from English to {language}. Do not change the property names, please wrap the output in triple backticks:\n\n\`\`\`
    {json}
    \`\`\``;
const translationPrompt = new PromptTemplate({
  template,
  inputVariables: ["language", "json"],
});

async function translateJSON(id: string, jsonObject: any) {
  const { title, description, ...rest } = jsonObject;

  const translations: { [key: string]: any } = {
    "en-US": {
      title,
      description,
    },
  };

  const chunkSize = 20;

  for (let i = 0; i < languages.length; i += chunkSize) {
    const chunk = languages.slice(i, i + chunkSize);

    const chunkPromises = chunk.map(async (language, j) => {
      const input = await translationPrompt.format({
        language: language.language,
        json: JSON.stringify({ title, description }, null, 2),
      });

      let translatedJson: string | undefined;
      let translatedJsonObject: any;
      let response: string | undefined;

      try  {
        response = await model.call(input);

        // match the json defined by the curly braces
        translatedJson = response.match(/\{.*\}/s)?.[0]?.trim();
      } catch (err) {
        console.error(
          `${id} - ${language.language}: Could not translate JSON: ${input}`
        );
      }

      if (response && !translatedJson) {
        try {
          translatedJsonObject = JSON.parse(response.trim());
        } catch (err) {
          console.error(
            `${id} - ${language.language}: Could not extract translated JSON from response: ${response}`
          );
        }
      } else if (translatedJson) {
        try {
          translatedJsonObject = JSON.parse(translatedJson);
        } catch (err) {
          console.error(
            `${id} - ${language.language}: Could not extract translated JSON from response: ${response}`
          );
        }
      }

      if (translatedJsonObject) {
        translations[language.locale_code] = translatedJsonObject;

        console.log(
          `Finished translating ${language.language} (${j + 1}/${
            chunk.length
          } in chunk, total: ${i + j + 1}/${languages.length})`
        );
      }
    });

    await Promise.all(chunkPromises);
  }

  return {
    ...rest,
    i18n: translations,
  };
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function trackPromise(p: Promise<any>) {
  let isCompleted = false;
  p.then(() => { isCompleted = true; })
    .catch(() => { isCompleted = true; }); // Also track if promise is rejected

  return {
    promise: p,
    isCompleted: () => isCompleted,
  };
}

async function processFiles() {
  const files = await readdir(INPUT_DIR);
  let trackedPromises: { promise: Promise<any>, isCompleted: () => boolean }[] = [];
  let isFirst = true;

  for (const file of files) {
    if (path.extname(file) === ".json") {
      // Create a delay before starting the file processing
      if (!isFirst)
      await delay(15000);

      isFirst = false;
      const trackedPromise = trackPromise(processFile(file));
      trackedPromises.push(trackedPromise);

      // Only allow 5 Promises to be active at once
      while (trackedPromises.length >= 5 || trackedPromises.length === files.length) {
        await Promise.race(trackedPromises.map(tp => tp.promise));
        // Remove completed promises
        trackedPromises = trackedPromises.filter(tp => !tp.isCompleted());
      }
    }
  }

  // Await any remaining Promises
  await Promise.all(trackedPromises.map(tp => tp.promise));
}

async function processFile(file: string) {
  const filePath = path.join(INPUT_DIR, file);
  const data = await readFile(filePath, "utf-8");
  const jsonObject = JSON.parse(data);
  const id = jsonObject.id ?? path.basename(file, ".json");

  console.log(`Processing ${id}...`);

  // Create translated version
  const translatedJson = await translateJSON(id, jsonObject);

  // Output multi-translation version into the "/resources" directory
  const translatedFileName = path.join(OUTPUT_DIR, file);
  await writeFile(
    translatedFileName,
    JSON.stringify(translatedJson, null, 2),
    "utf-8"
  );

  // Output an original copy of the file into the "/processed" directory
  const processedFileName = path.join(PROCESSED_DIR, file);
  await writeFile(processedFileName, data, "utf-8");

  // remove the original file from the "/intake" directory
  await unlink(filePath);

  console.log(`Finished processing ${id}!`);
}

processFiles();

export {};
