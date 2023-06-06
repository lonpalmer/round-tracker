import { readFile, writeFile } from "fs/promises";
import { mkdirp } from "mkdirp";

export async function generateRunningVersion() {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  const runningVersionTemplate = `export default {runningVersion: \"${packageJson.version}\"};`;

  const dirPath = "src/generated";

  await mkdirp(dirPath);
  await writeFile(`${dirPath}/running_version.mjs`, runningVersionTemplate);
}
