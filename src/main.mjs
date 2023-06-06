import { log } from "./logger.mjs";
import ver from "./generated/running_version.mjs";

Hooks.on("init", () => {
  log(`Initializing Round Tracker at version v${ver.runningVersion}`);
});
