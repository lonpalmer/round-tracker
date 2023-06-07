import { v4 as uuidv4 } from "uuid";

/**
 * Round events tracking.
 */

const SCOPE = "round_events";
const EVENTS_KEY = "events";

/**
 * @typedef {Object} RoundEvent The data object for a round event.
 * @property {String} id The unique ID of the event.
 * @property {boolean} fired Whether the event has fired.
 * @property {number} round The round number of the event.
 * @property {string} text Text to put into chat when this event occurs.
 */

/**
 * Gets the events for the given CombatDocument.
 *
 * @param {Object} document The document containing the events.
 * @returns {RoundEvent[]} The events for the given CombatDocument.
 */
function getEvents(document) {
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
 * @returns {RoundEvent[]} Updated list of events for the current combat document.
 */
export async function addEvent(round, text, document) {
  const event = {
    id: uuidv4(),
    fired: false,
    round,
    text,
  };

  const events = getEvents(document);
  events.push(event);
  await setEvents(events, document);

  return listEvents(document);
}

export function findEvents(round, fired, document) {
  return getEvents(document).filter(
    (event) => event.round === round && event.fired === fired
  );
}

export async function fireEvents(round, document) {
  const events = findEvents(round, false, document);
  for (const event of events) {
    event.fired = true;
  }
  await setEvents(events, document);
  return events;
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
