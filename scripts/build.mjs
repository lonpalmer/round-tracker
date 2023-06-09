import * as esbuild from "esbuild";
import { buildFoundryConfig } from "./foundry_config.mjs";
import { generateRunningVersion } from "./running_version.mjs";
import { copyTemplates } from "./copytemplates.mjs";
import { copyImgs } from "./copy_img.mjs";

// set a watch var to true if the --watch flagg is passed
const watch = process.argv.includes("--watch");

// use fs to delete all the files in the dist folder
// await fs.rm("dist/*", { recursive: true, force: true });

const options = {
  entryPoints: ["src/main.mjs"],
  outfile: "dist/main.mjs",
  bundle: true,
  platform: "neutral",
  target: ["esnext"],
  format: "esm",
  minify: true,
  sourcemap: true,
};

await generateRunningVersion();
await buildFoundryConfig();
await copyTemplates();
await copyImgs();

if (!watch) {
  await esbuild.build(options);
} else {
  const ctx = await esbuild.context(options);
  console.log("Watching for changes...");
  await ctx.watch();
}
