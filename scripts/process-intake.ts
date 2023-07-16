import fs from "fs";
import path from "path";
import { promisify } from "util";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import languages from "../languages.json";

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

      const response = await model.call(input);

      let translatedJson = response
        .match(/```(json)?([\s\S]*)```/)?.[2]
        ?.trim();
      let translatedJsonObject: any;

      if (!translatedJson) {
        try {
          translatedJsonObject = JSON.parse(response.trim());
        } catch (err) {
          console.error(
            `${id} - ${language.language}: Could not extract translated JSON from response: ${response}`
          );
        }
      } else {
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

async function processFiles() {
  try {
    const files = await readdir(INPUT_DIR);

    for (const file of files) {
      const filePath = path.join(INPUT_DIR, file);

      // Ensure we're only processing .json files
      if (path.extname(file) === ".json") {
        const id = path.basename(file, ".json");

        const data = await readFile(filePath, "utf-8");

        const jsonObject = JSON.parse(data);

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
      }
    }
  } catch (err) {
    console.error(err);
  }
}

processFiles();
