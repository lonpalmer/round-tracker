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
