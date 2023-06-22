import { copy } from "fs-extra";

// Build script that copies the templates to the dist folder.

export async function copyTemplates() {
  await copy("src/applications", "dist/applications");
}
