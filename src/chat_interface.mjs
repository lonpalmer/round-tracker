import { addEvent } from "./round_events.mjs";
import { log } from "./logger.mjs";

// RegEx which checks if a message starts with /rea then has a second argument which is a number or a number preceded by a + sign and the second argument is just text, numbers and punctuation.
const addMessageRegex = /^\/rea\s(\+?\d+)\s(.*)$/;

export function scanMessage(message) {
  let parts;

  parts = message.match(addMessageRegex);
  if (parts) {
    log("Message matches /rea");
    return slashAdd(parts);
  }
}

export async function slashAdd(parts) {
  let round = parts[1];

  if (round.startsWith("+")) {
    round = round.substring(1);
    try {
      round = game.combat.current.round + Number(round);
    } catch (e) {
      // if e is due to game not being initialized then we can just use the round as a number.
      log(
        "game.combat.current.round is not a number.  Game is probably not initialized."
      );
      if (e instanceof ReferenceError) {
        round = Number(round);
      }
    }
  } else {
    round = Number(round);
  }

  let text = parts[2];

  let events = await addEvent(round, text, game.combat);
  printEventsInChat(events);
  return true;
}

export function printEventsInChat(events) {
  let printedEvents = [];

  events.forEach((event) => {
    printedEvents.push(
      `<li> ${event.fired ? "✅" : ""} round ${event.round}: ${event.text}</li>`
    );
  });

  let msgData = {
    content: `<div><div>All Events</div><ul>${printedEvents.join(
      ""
    )}</ul></div>`,
  };

  ChatMessage.create(msgData);
}

export function printFiredEventsInChat(events) {
  let printedEvents = [];

  events.forEach((event) => {
    printedEvents.push(`<li><i>Event</i> ${event.text}</li>`);
  });

  let msgData = {
    content: `<div><div>Fire Events</div><ul>${printedEvents.join(
      ""
    )}</ul></div>`,
  };

  ChatMessage.create(msgData);
}
