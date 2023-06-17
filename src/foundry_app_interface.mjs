import { addEvent, RoundEvent, removeEvent } from "./round_events.mjs";

/**
 * @typedef {Object} Mob
 * @property {string} name
 * @property {string} actorId
 * @property {string} linkedActorId
 * @property {Object} token  // FromFoundry
 */

/**
 * @typedef {Object} Effect
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 */

/**
 * @typedef {Object} RoundEventFormData
 
 * @property {Object} combat // From Foundry
 * @property {Object} scene // From Foundry
 * @property {RoundEvent} roundEvent 
 * @property {Mob[]} mobs
 * @property {Effects[]} effects
 */

class RoundEventForm extends FormApplication {
  constructor(roundEventFormData) {
    super();

    // If the round event is undefined then we will create a new one.
    if (!roundEventFormData.roundEvent) {
      roundEventFormData.roundEvent = {
        id: undefined,
        fired: false,
        round: 0,
        text: "",
      };
    }

    this.roundEventFormData = roundEventFormData;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "round-event-form",
      title: "Round Event",
      template: "modules/round-tracker/templates/round_tracker_add.hbs",
      classes: [],
      popOut: true,
      width: 400,
      height: "auto",
      resizable: true,
      closeOnSubmit: true,
    });
  }

  getData() {
    return {
      refData: this.roundEventFormData,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  async _updateObject(event, formData) {
    let doc = game.combat.current;
    let roundText = formData["round"];

    let round = 0;

    if (roundText.startsWith("+")) {
      round = game.combat.current.round + Number(roundText.substring(1));
    } else {
      round = Number(roundText);
    }

    this.roundEvent.round = round;
    this.roundEvent.text = formData["text"].trim();

    // If the round event has an id then we are updating an existing event.
    if (this.roundEvent.id) {
      await removeEvent(this.roundEvent.id, doc);
    }

    await addEvent(this.roundEvent.round, this.roundEvent.text, doc);
  }
}

function displayRoundEventForm(combatDoc, roundEvent) {
  // game.scenes.get(combat.sceneId).tokens.get(combatant.tokenId)

  let scene = combatDoc.scene;
  let effects = CONFIG.statusEffects.map((effect) => {
    return {
      id: effect.id,
      name: effect.name,
      icon: effect.icon,
    };
  });

  let mobs = combatDoc.combatants.map((combatant) => {
    let token = scene.tokens.get(combatant.tokenId);
    let linkedActorId = token.actor?.data._id;
    return {
      name: combatant.name,
      actorId: combatant.actorId,
      linkedActorId,
      token,
    };
  });

  let roundEventFormData = {
    combat: combatDoc,
    scene,
    roundEvent,
    mobs,
    effects,
  };

  const roundEventForm = new RoundEventForm(roundEventFormData);
  roundEventForm.render(true);
}

export function showAddRoundEventForm(combatDoc) {
  const roundEvent = {
    id: undefined,
    fired: false,
    round: 0,
    text: "",
  };

  displayRoundEventForm(combatDoc, roundEvent);
}

export function showEditRoundEventForm(combatDoc, roundEvent) {
  displayRoundEventForm(combatDoc, roundEvent);
}
