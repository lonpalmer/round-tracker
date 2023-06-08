import { log } from "./logger.mjs";
import ver from "./generated/running_version.mjs";
import { printFiredEventsInChat, scanMessage } from "./chat_interface.mjs";
import { onNewCombat, fireEvents } from "./round_events.mjs";

Hooks.on("init", () => {
  log(`Initializing Round Tracker at version v${ver.runningVersion}`);
});

Hooks.on("combatStart", (combat, updateData) => {
  onNewCombat(combat);
});


Hooks.on("combatRound", (combat, updateData, updateOptions ) => {

  fireEvents(combat.current.round, combat)
    .then((events) => {
      printFiredEventsInChat(events);
    });
  

});



Hooks.on("chatMessage", (chatLog, message, chatData) => {

  if(scanMessage(message)) {
    return false;
  }

});
