import { readFile, writeFile, mkdir } from "fs/promises";

export async function buildFoundryConfig() {
  let pkg = JSON.parse(await readFile("package.json", "utf8"));
  let foundryConfig = JSON.parse(
    await readFile("src/foundry/module.json", "utf8")
  );

  foundryConfig.version = pkg.version;

  // Check if the dist folder exists and create it if it doesn't
  try {
    await mkdir("dist");
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }

  await writeFile("dist/module.json", JSON.stringify(foundryConfig, null, 2));
}