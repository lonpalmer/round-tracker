import { v4 as uuidv4 } from "uuid";
import { log } from "./logger.mjs";

/**
 * Round events tracking.
 */

const SCOPE = "round-tracker";
const EVENTS_KEY = "events";

/**
 * @typedef {Object} RoundEvent The data object for a round event.
 * @property {String} id The unique ID of the event.
 * @property {boolean} fired Whether the event has fired.
 * @property {number} round The round number of the event.
 * @property {string} text Text to put into chat when this event occurs.
 * @property {Array.<string>} combatants The combatant IDs that are involved in this event.
 * @property {Array.<string>} effects The effect IDs that are applied to the combatants.
 */

export function onNewCombat(combat) {
  combat.setFlag(SCOPE, EVENTS_KEY, []);
}

/**
 * Gets the events for the given CombatDocument.
 *
 * @param {Object} document The document containing the events.
 * @returns {RoundEvent[]} The events for the given CombatDocument.
 */
export function getEvents(document) {
  return document.getFlag(SCOPE, EVENTS_KEY) || [];
}

/**
 * Set the events to all the CombatDocuments for all players.
 *
 * @param {RoundEvent[]} events
 * @param {Object} document
 * @returns Promise<void> A promise that resolves when the events have been set.
 */
async function setEvents(events, document) {
  return document.setFlag(SCOPE, EVENTS_KEY, events);
}

/**
 * This returns a *copy* of the events for the given CombatDocument.
 *
 * @param {Object} document The document containing the events.
 * @returns {RoundEvent[]} A shallow copy of the events for the given CombatDocument.
 */
export function listEvents(document) {
  let events = getEvents(document);

  return events.map((ev) => {
    return { ...ev };
  });
}

/**
 * Adds a new event to the list of events for the given CombatDocument.
 *
 * @param {number} round Round to fire the event
 * @param {string} text Text to put into chat when this event occurs.
 * @param {Object} document The document containing the events.
 * @param {Array.<string>} combatants The combatant IDs that are involved in this event.
 * @param {Array.<string>} effects The effect IDs that are applied to the combatants.
 * @returns {RoundEvent[]} Updated list of events for the current combat document.
 */
export async function addEvent(round, text, document, combatants, effects) {
  // make the round a number if it isn't already one.
  round = Number(round);

  if (isNaN(round)) {
    throw new Error(
      "Round must be a number greater than the current combat round."
    );
  }

  if (!text || text.length === 0) {
    throw new Error("Text must not be empty.");
  }

  if (!document) {
    throw new Error("Document must not be empty.");
  }

  if (!combatants) {
    combatants = [];
  }

  if (!effects) {
    effects = [];
  }

  const event = {
    id: uuidv4(),
    fired: false,
    round,
    text,
    combatants,
    effects,
  };

  const events = getEvents(document);
  events.push(event);
  await setEvents(events, document);

  return listEvents(document);
}

export function findEvents(round, fired, document) {
  const events = getEvents(document);
  const filtered = events.filter(
    (event) => event.round === round && event.fired === fired
  );
  return filtered;
}

export async function fireEvents(round, document) {
  log(`Firing events for round ${round}.`);

  // make sure the round is a number
  round = Number(round);

  if (isNaN(round)) {
    throw new Error("Round must be a number.");
  }

  if (!document) {
    throw new Error("Document must not be empty.");
  }

  const events = getEvents(document);

  if (!events) {
    throw new Error("Events are missing from the provided document.");
  }

  const toFire = events.filter(
    (event) => event.round === round && !event.fired
  );

  if (toFire.length > 0) {
    toFire.forEach((event) => {
      event.fired = true;
    });

    await setEvents(events, document);
  }

  return toFire;
}

/**
 * Fire a specific event.
 * @param {string} id ID of the event to remove
 * @param {Object} document The document containing the events.
 * @returns {boolean} Whether the event was fired.
 */
export async function fireEvent(id, document) {
  const events = getEvents(document);
  const event = events.find((event) => event.id === id);
  if (event) {
    event.fired = true;
    await setEvents(events, document);
  }
  return true;
}

/**
 *
 * @param {string} id ID of the event to remove
 * @param {Object} document The document containing the events.
 * @returns {boolean} Whether the event was removed.
 */
export async function removeEvent(id, document) {
  const events = getEvents(document);
  const index = events.findIndex((event) => event.id === id);
  if (index >= 0) {
    events.splice(index, 1);
    await setEvents(events, document);
  }
  return true;
}

/**
 * Takes the user input and returns the round number indicated or throws an error.
 * @param {string} roundInput User input for the round
 * @param {Object} combatDoc Foundry Combat Document
 * @returns {number} The round number for this event.
 */
export function parseRoundInput(roundInput, combatDoc) {
  let plus = false;
  let round;

  if (roundInput.startsWith("+")) {
    plus = true;
    round = Number(roundInput.substring(1));
  } else {
    round = Number(roundInput);
  }

  if (isNaN(round)) {
    throw new Error("Round must be a number.");
  }

  if (plus) {
    round += combatDoc.round;
  }

  return round;
}
