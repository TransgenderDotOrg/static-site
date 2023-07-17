import fs from "fs";
import path from "path";
import { promisify } from "util";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import languages from "../languages.json" assert { type: "json" };

// Promisify fs methods for async/await usage
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const LOCALES_DIR = path.join(__dirname, "../src/locales");

const model = new OpenAI({ modelName: "gpt-4" });

const template = `Translate the following text from English to {language}: "{text}"`;
const translationPrompt = new PromptTemplate({
  template,
  inputVariables: ["language", "text"],
});

async function generateMissingTranslations() {
  try {
    const files = await readdir(LOCALES_DIR);

    // Read the English locales file
    const enUSFilePath = path.join(LOCALES_DIR, "en-US.json");
    const enUSFileData = await readFile(enUSFilePath, "utf-8");
    const enUSLocale = JSON.parse(enUSFileData);

    const translationPromises = files.map(async file => {
      const localeCode = path.basename(file, ".json");
      
      if (localeCode === "en-US") {
        // Skip the English file
        return;
      }

      const filePath = path.join(LOCALES_DIR, file);
      const fileData = await readFile(filePath, "utf-8");
      const locale = JSON.parse(fileData);

      const language = languages.find(l => l.locale_code === localeCode)!;

      for (const key in enUSLocale) {
        if (!(key in locale)) {
          // Key is missing from this locale, generate a translation
          const text = enUSLocale[key];

          const input = await translationPrompt.format({
            language: language.language,
            text,
          });

          const response = await model.call(input);
          const translatedText = response.trim();

          // Add the translated text to this locale
          locale[key] = translatedText;
        }
      }

      // Write the updated locale back to the file
      await writeFile(filePath, JSON.stringify(locale, null, 2), "utf-8");
      
      console.log(`Finished processing ${language.language}`);
    });

    // Wait for all translations to finish
    await Promise.all(translationPromises);

    console.log("Finished generating missing translations");
  } catch (err) {
    console.error(err);
  }
}

generateMissingTranslations();

export {};
