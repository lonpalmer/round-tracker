import { readFile, writeFile } from "fs/promises";

export async function buildFoundryConfig() {
  let pkg = JSON.parse(await readFile("package.json", "utf8"));
  let foundryConfig = JSON.parse(
    await readFile("src/foundry/module.json", "utf8")
  );

  foundryConfig.version = pkg.version;

  await writeFile("dist/module.json", JSON.stringify(foundryConfig, null, 2));
}
