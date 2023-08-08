import fs from "fs";
import path from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

const inputDir = path.join(__dirname, "../resources");
const outputDir = path.join(__dirname, "../src/resources");
const reviewDir = path.join(__dirname, "../review");
const languageFile = path.join(__dirname, "../languages.json");

interface Indexable {
  [key: string]: string
}

// This function validates that the fields expected by the Resource interface are the correct types
const validateResource = (resource: Indexable) => {
  const stringKeys = [
    'id',
    'slug',
    'externalUrl',
    'title',
    'description',
    'address',
    'phoneNumber',
    'email',
  ]
  for (const key of stringKeys) {
    if (resource[key] && typeof resource[key] !== 'string') return false
  }
  const arrayKeys = ['tags', 'organizationType', 'latLng']
  for (const key of arrayKeys) {
    if (resource[key] && !Array.isArray(resource[key])) return false
  }

  return true
}

const processJsonFiles = async () => {
  // Read the languages file
  const languagesContent = await readFile(languageFile, "utf-8");
  const languages = [
    ...JSON.parse(languagesContent),
    { language: "English", locale_code: "en-US" },
  ];

  // Iterate over each language
  for (const language of languages) {
    const localeCode = language.locale_code;

    // Get all the JSON files in the input directory
    const files = await readdir(inputDir);
    const jsonFiles = files.filter((file) => path.extname(file) === ".json");

    let output: any[] = [];
    const invalid: any[] = [];

    // Process each JSON file
    for (const file of jsonFiles) {
      // Read the file
      const content = await readFile(path.join(inputDir, file), "utf-8");
      const data = JSON.parse(content);

      // Process the data with the external library
      if (data.i18n[localeCode]) {
        const { i18n, ...resourceData } = data;
        const resource = {
          ...resourceData,
          title: i18n[localeCode].title,
          description: i18n[localeCode].description,
        };
        validateResource(resource) ? output.push(resource) : invalid.push(data);
      }
    }

    // Write the processed data to the output directory
    const outputFilePath = path.join(outputDir, `${localeCode}.json`);
    await writeFile(outputFilePath, JSON.stringify(output, null, 2), "utf-8");

    // Write invalid resources to review directory
    invalid.forEach(
      async (r) =>
        await writeFile(path.join(reviewDir, `${r.id}.json`), JSON.stringify(r, null, 2), 'utf-8'),
    )
  }
};

// Run the script
processJsonFiles().catch(console.error);

export {};
