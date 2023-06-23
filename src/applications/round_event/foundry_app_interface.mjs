import { addEvent, RoundEvent, removeEvent } from "../../round_events.mjs";
import { v4 as uuidv4 } from "uuid";

/**
 * @typedef {Mob} Mob - A combatant in the combat which adds in information about the token.
 * @property {string} id - The ID of the combatant.
 * @property {string} name - The name of the combatant.
 * @property {string} actorId - The ID of the actor for the combatant.
 * @property {string} linkedActorId - The ID of the linked actor for the combatant.
 * @property {Object} token - Foundry Token object. The token for the combatant.
 */


/**
 * Foundry Application for adding or editing a round event.
 */
class RoundEventForm extends FormApplication {
  /**
   *
   * @param {Object} combatDoc Foundry Combat document.
   * @param {Array.<Object>} effects List of all possible foundry status effects.
   * @param {Array.<Mob>} mobs List of all combatants in the combat along with their token.
   * @param {RoundEvent} roundEvent Round event to edit. If null, then a new round event is created.
   */
  constructor(combatDoc, effects, mobs, roundEvent) {
    super();

    this.combatDoc = combatDoc;
    this.effects = effects;
    this.roundEvent = roundEvent;
    this.mobs = mobs;
    this._ID = uuidv4();
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "round-event-form",
      title: "Round Event",
      template:
        "modules/round-tracker/applications/round_event/round_tracker_add.hbs",
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
      _ID: this._ID,
      roundEvent: this.roundEvent,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html
      .find(this.TID("combatants-list-section"))
      .append(this.makeCombatantList());

    html
      .find(this.TID("status-effects-list-section"))
      .append(this.makeStatusEffectList());
  }

  /**
   * TID - Template ID
   * Each element in the template needs a unique ID.  This function
   * returns the unique ID for the given ID.
   *
   * @param {string} id ID  which needs the unique ID for this class appended.
   * @returns The unique ID needed  to identify the ID elements in the template.
   */
  TID(id) {
    return `#${id}-${this._ID}`;
  }

  /**
   * Create the sleect list and the buttons for the combatants.
   * @returns {JQuery} JQuery object containing the HTML for the combatant list.
   */
  makeCombatantList() {
    let selectTag = $("<select class='hidden' name ='combatants' multiple>");

    const buttonList = this.mobs.map((mob) => {
      selectTag.append($("<option>").val(mob.id).text(mob.id));

      let button = $(`
        <div class="flex flex-col w-8 h-12 gap-0">
            <button class="w-8 h-8 border-0 rounded-full bg-black opacity-40 hover:opacity-100 cursor-pointer peer">
                <img class="border-0" src="${mob.token.texture.src}" alt="round-tracker" class="w-8 h-8" />
            </button>
            <div class="invisible peer-hover:visible text-xs overflow-clip overflow-ellipsis text-center">
                ${mob.name} 
            </div>
        </div>`);

      button.on("click", (event) => {
        let value = !selectTag.options[mob.id].selected;
        selectTag.options[mob.id].selected = value;

        if (value) {
          button.removeClass("opacity-40").addClass("opacity-100");
        } else {
          button.removeClass("opacity-100").addClass("opacity-40");
        }
      });

      return button;
    });

    let combatantsBlock = $(`
      <div>
        <label for='hidden-combatants-select' class="flex flex-row gap-1 justify-start items-center"><i class="fa-solid fa-caret-right"></i><span class="text-sm font-semibold">Combatants</span></label>
        <input name='hidden-combatants-select' type="checkbox" class="hidden" />
        <div class="hidden flex-row flex-wrap gap-2 p-2 border border-gray-700 w-full">
        </div>
      </div>
    `);

    let label = combatantsBlock.find("label");
    let icon = combatantsBlock.find("label i");
    let checkbox = combatantsBlock.find("input");
    let combatantsList = combatantsBlock.find("div");

    combatantsBlock.append(selectTag);

    label.on("click", (event) => {
      checkbox.prop("checked", !checkbox.prop("checked"));

      if (checkbox.prop("checked")) {
        icon.removeClass("fa-caret-right").addClass("fa-caret-down");
        combatantsList.removeClass("hidden").addClass("flex");
      } else {
        icon.removeClass("fa-caret-down").addClass("fa-caret-right");
        combatantsList.removeClass("flex").addClass("hidden");
      }
    });

    combatantsList.append(buttonList);

    return combatantsBlock;
  }

  /**
   * Make the select list and buttons for the status effects.
   * @returns {JQuery} JQuery object containing the HTML for the status effect list.
   */
  makeStatusEffectList() {
    let statusEffects = this.effects;
    let selectTag = $(
      "<select class='hidden' name ='status-effects' multiple>"
    );

    const buttonList = statusEffects.map((effect) => {
      selectTag.append($("<option>").val(effect.id).text(effect.id));
      let button = $(`
        <div class="flex flex-col w-8 h-12 gap-0">
            <button class="w-8 h-8 border-0 rounded-full bg-gray-700 opacity-40 hover:opacity-100 cursor-pointer peer">
                <img class="border-0" src="${effect.icon}" alt="round-tracker" class="w-8 h-8" />
            </button>
            <div class="invisible peer-hover:visible text-xs overflow-clip overflow-ellipsis text-center">
                ${effect.name}
            </div>
        </div>
      `);

      button.on("click", (event) => {
        let value = !selectTag.options[effect.id].selected;
        selectTag.options[effect.id].selected = value;

        if (value) {
          button.removeClass("opacity-40").addClass("opacity-100");
        } else {
          button.removeClass("opacity-100").addClass("opacity-40");
        }
      });

      return button;
    });

    let statusEffectsBlock = $(`
      <div>
        <label for='hidden-status-effects-select' class="flex flex-row gap-1 justify-start items-center">
          <i class="fa-solid fa-caret-right"></i>
          <span class="text-sm font-semibold">Status Effects</span>
        </label>
        <input name='hidden-status-effects-select' type="checkbox" class="hidden" />
        <div class="hidden flex-row flex-wrap gap-2 p-2 border border-gray-700 w-full">
        </div>
      </div>
    `);

    let label = statusEffectsBlock.find("label");
    let icon = statusEffectsBlock.find("label i");
    let checkbox = statusEffectsBlock.find("input");
    let statusEffectsList = statusEffectsBlock.find("div");

    label.on("click", (event) => {
      checkbox.prop("checked", !checkbox.prop("checked"));

      if (checkbox.prop("checked")) {
        icon.removeClass("fa-caret-right").addClass("fa-caret-down");
        statusEffectsList.removeClass("hidden").addClass("flex");
      } else {
        icon.removeClass("fa-caret-down").addClass("fa-caret-right");
        statusEffectsList.removeClass("flex").addClass("hidden");
      }
    });

    statusEffectsList.append(buttonList);

    return statusEffectsBlock;
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
      id: combatant._id,
      name: combatant.name,
      actorId: combatant.actorId,
      linkedActorId,
      token,
    };
  });

  const roundEventForm = new RoundEventForm(
    combatDoc,
    effects,
    mobs,
    roundEvent
  );
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
