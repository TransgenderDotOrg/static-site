import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, "../processed");
const TARGET_DIR = path.join(__dirname, "../resources");

function patchFiles() {
  const sourceFiles = fs.readdirSync(SOURCE_DIR);

  sourceFiles.forEach(async (fileName) => {
    try {
      const sourceFilePath = path.join(SOURCE_DIR, fileName);
      const targetFilePath = path.join(TARGET_DIR, fileName);

      // Read source file
      const sourceFileContent = await fs.promises.readFile(
        sourceFilePath,
        "utf8"
      );
      const sourceJson = JSON.parse(sourceFileContent);

      // Read target file
      const targetFileContent = await fs.promises.readFile(
        targetFilePath,
        "utf8"
      );
      const targetJson = JSON.parse(targetFileContent);

      // Merge source and target JSON
      const updatedJson = {
        ...targetJson, // Retains additional fields from the target file
        ...sourceJson, // Patches updated information from the source file
      };

      // Write updated JSON back to target file
      await fs.promises.writeFile(
        targetFilePath,
        JSON.stringify(updatedJson, null, 2)
      );
      console.log(`Patched ${fileName}`);
    } catch (error) {
      console.error(`Error patching file ${fileName}: ${error}`);
    }
  });
}

patchFiles();

export {};
