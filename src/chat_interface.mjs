import { addEvent, getEvents, parseRoundInput } from "./round_events.mjs";
import { log } from "./logger.mjs";
import { showAddRoundEventForm } from "./applications/round_event/round_event_application.mjs";

// RegEx which checks if a message starts with /rea then has a second argument which is a number or a number preceded by a + sign and the second argument is just text, numbers and punctuation.
const addMessageRegex = /^\/rea\s(\+?\d+)\s(.*)$/;

// RegEx which checks if a message is just /readd
const adddMessageRegexUi = /^\/readd$/;

// Regex which checks if a message is just /rels
const listMessageRegex = /^\/rels$/;

export function scanMessage(message) {
  let parts;

  parts = message.match(addMessageRegex);
  if (parts) {
    log("Message matches /rea");
    return slashAdd(parts);
  }

  parts = message.match(adddMessageRegexUi);
  if (parts) {
    log("Message matches /readd");
    return slashAddUi();
  }

  parts = message.match(listMessageRegex);
  if (parts) {
    log("Message matches /rels");
    return slashList();
  }
}

export function slashAddUi() {
  showAddRoundEventForm(game.combat);
  return true;
}

export async function slashAdd(parts) {
  let round = parseRoundInput(parts[1], game.combat);
  let text = parts[2];

  let events = await addEvent(round, text, game.combat);
  printEventsInChat(events);
  return true;
}

export function slashList() {
  let events = getEvents(game.combat);
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
