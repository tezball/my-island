import { describe, expect, it } from "vitest";
import {
  marksByPlace,
  placesForMark,
  placesOnMap,
  visitMarkLabel,
  type VisitIntent,
} from "../api/visitIntent";
import type { Place } from "../api/catalog";

function place(id: string, name: string): Place {
  return {
    id,
    slug: id,
    name,
    description: null,
    category: { id: "poi", label: "Point of interest" },
    county: { id: "kerry", name: "Kerry" },
    town: null,
    latitude: 52,
    longitude: -9.5,
    published: true,
    priceBand: null,
    website: null,
    phone: null,
    facilities: [],
    imageUrl: null,
    imageCredit: null,
    imageLicence: null,
    visitedCount: 0,
  };
}

describe("placesForMark", () => {
  const rows = [place("a", "A"), place("b", "B"), place("c", "C")];
  const intents: VisitIntent[] = [
    { placeId: "a", mark: "visited", updatedAt: "2026-09-19T00:00:00Z" },
    { placeId: "b", mark: "next", updatedAt: "2026-09-19T00:00:00Z" },
  ];

  it("keeps only the asked private list", () => {
    const marks = marksByPlace(intents);
    expect(placesForMark(rows, marks, "visited").map((p) => p.id)).toEqual(["a"]);
    expect(placesForMark(rows, marks, "saved")).toEqual([]);
  });

  it("includes Saved on the map with Visited and Next", () => {
    const marks = marksByPlace([
      ...intents,
      { placeId: "c", mark: "saved", updatedAt: "2026-09-19T00:00:00Z" },
    ]);
    expect(visitMarkLabel("visited")).toBe("Visited");
    expect(visitMarkLabel("next")).toBe("Next");
    expect(visitMarkLabel("saved")).toBe("Saved");
    expect(placesOnMap(rows, marks, "visited").map((p) => p.id)).toEqual(["a"]);
    expect(placesOnMap(rows, marks, "next").map((p) => p.id)).toEqual(["b"]);
    expect(placesOnMap(rows, marks, "saved").map((p) => p.id)).toEqual(["c"]);
  });
});
