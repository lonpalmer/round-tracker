import { addEvent } from "./round_events.mjs";


// RegEx which checks if a message starts with /rea then has a second argument which is a number or a number preceded by a + sign and the second argument is just text, numbers and punctuation.
const addMessageRegex = /^\/rea\s(\+?\d+)\s(.*)$/;

export function scanMessage(message) {

    let parts;

    parts = message.match(addMessageRegex);
    if(parts) {
        return slashAdd(parts);
    }

}


export async function slashAdd(parts) {

    if(!game.combat) {
        return { error: "There is no combat active." };
    }


    const currentRound = game.combat.current.round;
    let round = parts[1];
    let text = parts[2];

    // +sign means add the round number to the current round.
    if(round.startsWith("+")) {
        round = Number(round.substring(1)) + currentRound;
    }

    // If the round is not a number, return an error message.
    if(isNaN(round)) {
        return { error: "Round must be a number." };
    }

    // If the round is less than 1, return an error message.
    if(round < 1) {
        return { error: "Round must be greater than 0." };
    }

    // If the round is less than the curren round, return an error message.
    if(round < currentRound) {
        return { error: "Round must be greater than the current round." };
    }

    // If the text is empty, return an error message.
    if(text.length === 0) {
        return { error: "Text must not be empty." };
    }

    let events = await addEvent(round, text, game.combat);
    printEventsInChat(events);
    return true;

}


export function printEventsInChat(events) {
    
    let printedEvents = [];

    events.forEach((event) => {
        printedEvents.push(`<li> ${event.fired ? "✅" : ""} round ${event.round}: ${event.text}</li>`);
    });

    let msgData = {
        content: `<div><div>All Events</div><ul>${printedEvents.join("")}</ul></div>`
    }

    ChatMessage.create(msgData);
}

export function printFiredEventsInChat(events) {
    let printedEvents = [];

    events.forEach((event) => {
        printedEvents.push(`<li><i>Event</i> ${event.text}</li>`);
    });

    let msgData = {
        content: `<div><div>Fire Events</div><ul>${printedEvents.join("")}</ul></div>`
    }

    ChatMessage.create(msgData);
}