import { addEvent, RoundEvent, removeEvent } from "../../round_events.mjs";
import { v4 as uuidv4 } from "uuid";

class RoundEventForm extends FormApplication {
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
   *
   * @returns {JQuery} JQuery object containing the HTML for the combatant list.
   */
  makeCombatantList() {
    let selectTag = $("<select class='hidden' name ='combatants' multiple>");

    const buttonList = this.mobs.map((mob) => {
      selectTag.append($("<option>").val(mob.id).text(mob.id));

      let button = $(`<div class="flex flex-col w-8 h-12 gap-0">
            <button class="w-8 h-8 border-0 rounded-full bg-black opacity-40 hover:opacity-100 cursor-pointer peer">
                <img class="border-0" src="${mob.token.texture.src}" alt="round-tracker" class="w-8 h-8" />
            </button>
            <div class="invisible peer-hover:visible text-xs overflow-clip overflow-ellipsis text-center">
                ${mob.name} 
            </div>
        </div>`);

      button.on("click", (event) => {
        // option.attr("selected", !option.attr("selected"));
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

    let combatantsBlockStr = `<div>
      <label for='hidden-combatants-select' class="flex flex-row gap-1 justify-start items-center"><i class="fa-solid fa-caret-right"></i><span class="text-sm font-semibold">Combatants</span></label>
      
      <input name='hidden-combatants-select' type="checkbox" class="hidden" />
      
      <div class="hidden flex-row flex-wrap gap-2 p-2 border border-gray-700 w-full">
          
      </div>
    </div>
    `;

    let combatantsBlock = $(combatantsBlockStr);
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

  makeStatusEffectsList() {
    let statusEffects = this.statusEffects;

    const list = statusEffects.map((effect) => {
      let option = $(`<option value="${effect.id}">${effect.id}</option>`);
      let button = $(`<div class="flex flex-col w-8 h-10 gap-0">
            <button class="w-8 h-8 border-0 rounded-full bg-gray-700 opacity-40 hover:opacity-100 cursor-pointer peer">
                <img class="border-0" src="${effect.icon}" alt="round-tracker" class="w-8 h-8" />
            </button>
            <div class="invisible peer-hover:visible text-xs overflow-clip overflow-ellipsis text-center">
                ${effect.name} 
            </div>
        </div>`);

      button.click((event) => {
        option.attr("selected", !option.attr("selected"));
        if (option.attr("selected")) {
          button.removeClass("opacity-40").addClass("opacity-100");
        } else {
          button.removeClass("opacity-100").addClass("opacity-40");
        }
      });

      return { option: option, button: button };
    });

    return list;
  }

  // activateListeners(html) {
  //   super.activateListeners(html);

  //   // Dropdown for combatants
  //   let id = `#${TOID("round-tracker-combatants-dropdown")}`;
  //   html.find(id).click(this.roundTrackerCombatantsDropdownToggle);

  //   // Dropdown for status
  //   id = `#${TOID("round-tracker-status-dropdown")}`;
  //   html.find(id).click(this.roundTrackerStatusDropdownToggle);

  //   // Add combatant button
  //   id = `#${TOID("round-tracker-add-combatant")}`;
  //   html.find(id).click(this.roundTrackerToggleCombatant);

  //   // Add status button
  //   id = `#${TOID("round-tracker-add-status")}`;
  //   html.find(id).click(this.roundTrackerToggleStatus);

  // }

  // // Form control  functions.
  // roundTrackerDropdownToggle(toggleCheckbox, dropdownIcon, list) {
  //   toggleCheckbox.prop("checked", !toggleCheckbox.prop("checked"));

  //   if (toggleCheckbox.prop("checked")) {
  //     dropdownIcon.removeClass("fa-caret-right").addClass("fa-caret-down");
  //     list.removeClass("hidden").addClass("flex");
  //   } else {
  //     dropdownIcon.removeClass("fa-caret-down").addClass("fa-caret-right");
  //     list.removeClass("flex").addClass("hidden");
  //   }
  // }

  // roundTrackerCombatantsDropdownToggle() {
  //   let toggleCheckbox = $("#round-tracker-add-toggle");
  //   let dropdownIcon = $("#round-tracker-combatants-dropdown");
  //   let combatantsList = $("#round-tracker-conbatants-list");

  //   roundTrackerDropdownToggle(toggleCheckbox, dropdownIcon, combatantsList);
  // }

  // roundTrackerStatusDropdownToggle() {
  //   let toggleCheckbox = $("#round-tracker-add-status-toggle");
  //   let dropdownIcon = $("#round-tracker-add-status-dropdown");
  //   let statusList = $("#round-tracker-add-status-list");

  //   roundTrackerDropdownToggle(toggleCheckbox, dropdownIcon, statusList);
  //   this.setPosition({height:"auto"});
  // }

  // roundTrackerToggleCombatant(combatantId, button) {
  //   let btn = $(button);

  //   //find the value in the select input with the id round-tracker-select-combatants that matches the combatantId
  //   let combatant = $("#round-tracker-select-combatants")
  //     .find(`option[value=${combatantId}]`)
  //     .first();

  //   // toggle the selected prop on combatant
  //   combatant.attr("selected", !combatant.attr("selected"));

  //   // set the opacity on the btn based on the combatant selected prop
  //   if (combatant.attr("selected")) {
  //     btn.removeClass("opacity-40").addClass("opacity-100");
  //   } else {
  //     btn.removeClass("opacity-100").addClass("opacity-40");
  //   }
  // }

  // roundTrackerToggleStatus(status, button) {
  //   let btn = $(button);

  //   //find the value in the select input with the id round-tracker-select-status that matches the status
  //   let statusOption = $("#round-tracker-select-status")
  //     .find(`option[value=${status}]`)
  //     .first();

  //   // toggle the selected prop on statusOption
  //   statusOption.attr("selected", !statusOption.attr("selected"));

  //   // set the opacity on the btn based on the statusOption selected prop
  //   if (statusOption.attr("selected")) {
  //     btn.removeClass("opacity-40").addClass("opacity-100");
  //   } else {
  //     btn.removeClass("opacity-100").addClass("opacity-40");
  //   }
  // }
  // end form control functions.

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
