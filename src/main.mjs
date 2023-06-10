import { log } from "./logger.mjs";
import ver from "./generated/running_version.mjs";
import { printFiredEventsInChat, scanMessage } from "./chat_interface.mjs";
import { onNewCombat, fireEvents } from "./round_events.mjs";
import { makeHudButton } from "./hud.mjs";

Hooks.on("init", () => {
  log(`Initializing Round Tracker at version v${ver.runningVersion}`);
});

Hooks.on("combatStart", (combat, updateData) => {
  onNewCombat(combat);
});

Hooks.on("combatRound", (combat, updateData, updateOptions) => {
  fireEvents(updateData.round, combat).then((events) => {
    if (events.length > 0) {
      printFiredEventsInChat(events);
    }
  });
});

Hooks.on("chatMessage", (chatLog, message, chatData) => {
  if (scanMessage(message)) {
    return false;
  }
});

Hooks.on("renderTokenHUD", async (tokenHUD, html, data) => {
  let hudButton = await makeHudButton(tokenHUD, html, data);
  $("#token-hud").find("div.right").last().append(hudButton);
});
