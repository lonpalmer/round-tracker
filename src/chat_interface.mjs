import { addEvent } from "./round_events.mjs";

// RegEx which checks if a message starts with /rea then has a second argument which is a number or a number preceded by a + sign and the second argument is just text, numbers and punctuation.
const addMessageRegex = /^\/rea\s(\+?\d+)\s(.*)$/;

export function scanMessage(message) {
  let parts;

  parts = message.match(addMessageRegex);
  if (parts) {
    return slashAdd(parts);
  }
}

export async function slashAdd(parts) {
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
