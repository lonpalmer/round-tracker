
/**
 * Make the button for the HUD.  This button is displayed on the token HUD
 * when it's right-clicked.
 * @param {Object} hudDoc Foundry document for the HUD
 * @param {JQuery} html JQuery object for the HUD
 * @param {Object} token Foundry Token object
 * @returns {JQuery} JQuery object for the button
 */
export async function makeHudButton(hudDoc, html, token) {
  const buttonTemplate = await renderTemplate(
    "modules/round-tracker/templates/hud_button.html",
    {}
  );

  const button = $(buttonTemplate);

  button.click((e) => {
    console.log("Clicked button token " + JSON.stringify(token));
  });

  return button;
}
