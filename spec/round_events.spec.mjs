import * as round_events from "../src/round_events.mjs";

// write test cases to test all the functions in the round_events module
describe("round_events", () => {
  function makeMocDoc() {
    let flag = [];
    const mocDoc = jasmine.createSpyObj("document", ["getFlag", "setFlag"]);
    mocDoc.getFlag.and.callFake((scope, key) => {
      return flag;
    });
    mocDoc.setFlag.and.callFake((scope, key, value) => {
      return Promise.resolve(flag);
    });
    return mocDoc;
  }

  // Test the addEvents funciton by adding an event and then checking that it's been added.
  it("addEvent", async () => {
    const round = 1;
    const text = "test text";
    const mocDoc = makeMocDoc();

    const events = await round_events.addEvent(round, text, mocDoc);
    expect(events.length).toBe(1);
    expect(events[0].round).toBe(round);
    expect(events[0].text).toBe(text);
    expect(events[0].fired).toBe(false);
    expect(mocDoc.setFlag).toHaveBeenCalled();
  });

  // Add an event to a mocked document and then fire it using fireEvents.  Then ensure it's been fired.
  it("fireEvents", async () => {
    const round = 1;
    const text = "test text";
    const mocDoc = makeMocDoc();

    const events = await round_events.addEvent(round, text, mocDoc);
    expect(events.length).toBe(1);

    const firedEvents = await round_events.fireEvents(round, mocDoc);
    expect(firedEvents.length).toBe(1);
    expect(firedEvents[0].fired).toBe(true);
    expect(mocDoc.setFlag).toHaveBeenCalled();
  });

  // Test fireEvents by adding several events for round 1 and firing them.
  // Then ensure they've all been fired.  Also add a number of events for round two
  // and ensure they haven't been fired.
  it("fireEvents multiple", async () => {
    const mocDoc = makeMocDoc();

    for (let i = 0; i < 5; i++) {
      await round_events.addEvent(1, "test text 1 " + i, mocDoc);
    }

    for (let i = 0; i < 3; i++) {
      await round_events.addEvent(2, "test text 2 " + i, mocDoc);
    }

    const firedEvents = await round_events.fireEvents(1, mocDoc);
    const allEvents = round_events.listEvents(mocDoc);

    expect(firedEvents.length).toBe(5);
    expect(allEvents.length).toBe(8);
    expect(allEvents.filter((ev) => ev.fired === false).length).toBe(3);
    expect(allEvents.filter((ev) => ev.round === 2).length).toBe(3);
  });

  // Test removeEvent
  it("removeEvent", async () => {
    const mocDoc = makeMocDoc();

    await round_events.addEvent(1, "round 1", mocDoc);
    await round_events.addEvent(2, "round 2", mocDoc);

    let events1 = round_events.listEvents(mocDoc);

    let removeId = events1.find((e) => e.round === 1)?.id;

    await round_events.removeEvent(removeId, mocDoc);

    let events2 = round_events.listEvents(mocDoc);

    expect(events1.length).toBe(2);
    expect(events2.length).toBe(1);
    expect(events2[0].round === 2);
  });
});
