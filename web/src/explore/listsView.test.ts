import { describe, expect, it } from "vitest";
import { listsPanes, listsView } from "./listsView";

describe("listsView", () => {
  it("defaults to the list and accepts the map", () => {
    expect(listsView(null)).toBe("list");
    expect(listsView("list")).toBe("list");
    expect(listsView("map")).toBe("map");
  });
});

describe("listsPanes", () => {
  it("toggles been and want between list and map on a phone", () => {
    expect(listsPanes("list", false, "been")).toEqual({ showMap: false, showList: true });
    expect(listsPanes("map", false, "been")).toEqual({ showMap: true, showList: false });
    expect(listsPanes("map", false, "want")).toEqual({ showMap: true, showList: false });
  });

  it("shows the map and the list together on a wide screen", () => {
    expect(listsPanes("list", true, "want")).toEqual({ showMap: true, showList: true });
    expect(listsPanes("map", true, "been")).toEqual({ showMap: true, showList: true });
  });

  it("keeps never on the list when the map was requested", () => {
    expect(listsPanes("map", false, "never")).toEqual({ showMap: false, showList: true });
    expect(listsPanes("map", true, "never")).toEqual({ showMap: false, showList: true });
  });
});
