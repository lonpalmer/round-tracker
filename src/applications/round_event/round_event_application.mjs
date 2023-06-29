import {
  addEvent,
  RoundEvent,
  removeEvent,
  parseRoundInput,
} from "../../round_events.mjs";
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
        "modules/round-tracker/applications/round_event/round_event_template.hbs",
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

    let roundInput = html.find('input[name="round"]');
    let textInput = html.find('input[name="text"]');

    roundInput.on("focus", (event) => {
      roundInput.select();
    });

    textInput.on("focus", (event) => {
      textInput.select();
    });

    roundInput.trigger("focus");
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
        <div class="flex flex-col justify-center items-center w-16 h-20 gap-0">
            <div class="flex justify-center items-center w-16 h-16 border-0 rounded-full bg-gray-700 cursor-pointer overflow-clip peer">
                <img class="border-0 w-16 h-16 opacity-40" src="${mob.token.texture.src}" alt="round-tracker" />
            </div>
            <div class="text-md overflow-clip overflow-ellipsis text-center">
                ${mob.name} 
            </div>
        </div>`);

      button.on("click", (event) => {
        let option = selectTag.find(`option[value='${mob.id}']`);
        let value = !option.prop("selected");
        option.prop("selected", value);

        if (value) {
          button.find("img").removeClass("opacity-40").addClass("opacity-100");
        } else {
          button.find("img").removeClass("opacity-100").addClass("opacity-40");
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

      this.setPosition({ height: "auto" });
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
        <div class="flex flex-col justify-center items-center w-8 h-10 gap-0">
            <div class="w-8 h-8 border-0 rounded-full bg-gray-700 cursor-pointer peer flex justify-center items-center">
                <img class="w-8 h-8 border-0 opacity-40" src="${effect.icon}" alt="round-tracker" />
            </div>
            <div class="invisible peer-hover:visible text-xs text-center">
                ${effect.id}
            </div>
        </div>
      `);

      button.on("click", (event) => {
        let opt = selectTag.find(`option[value="${effect.id}"]`);
        let value = !opt.prop("selected");
        opt.prop("selected", value);

        if (value) {
          button.find("img").removeClass("opacity-40").addClass("opacity-100");
        } else {
          button.find("img").removeClass("opacity-100").addClass("opacity-40");
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

    statusEffectsBlock.append(selectTag);

    label.on("click", (event) => {
      checkbox.prop("checked", !checkbox.prop("checked"));

      if (checkbox.prop("checked")) {
        icon.removeClass("fa-caret-right").addClass("fa-caret-down");
        statusEffectsList.removeClass("hidden").addClass("flex");
      } else {
        icon.removeClass("fa-caret-down").addClass("fa-caret-right");
        statusEffectsList.removeClass("flex").addClass("hidden");
      }

      this.setPosition({ height: "auto" });
    });

    statusEffectsList.append(buttonList);

    return statusEffectsBlock;
  }

  async _updateObject(event, formData) {
    let round = parseRoundInput(formData["round"], this.combatDoc);

    this.roundEvent.round = round;
    this.roundEvent.text = formData["text"].trim();

    this.combatants = formData["combatants"];
    this.effects = formData["status-effects"];

    // If the round event has an id then we are updating an existing event.
    if (this.roundEvent.id) {
      await removeEvent(this.roundEvent.id, doc);
    }

    await addEvent(
      this.roundEvent.round,
      this.roundEvent.text,
      this.combatDoc,
      this.combatants,
      this.effects
    );
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
