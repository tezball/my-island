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
  it("toggles list and map on a phone for every mark", () => {
    expect(listsPanes("list", false)).toEqual({ showMap: false, showList: true });
    expect(listsPanes("map", false)).toEqual({ showMap: true, showList: false });
  });

  it("shows the map and the list together on a wide screen, including Saved", () => {
    expect(listsPanes("list", true)).toEqual({ showMap: true, showList: true });
    expect(listsPanes("map", true)).toEqual({ showMap: true, showList: true });
  });
});
