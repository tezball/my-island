import { describe, expect, it } from "vitest";
import {
  VISIT_MARK_LABEL,
  marksByPlace,
  placesForMark,
  placesOnMap,
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
    beenCount: 0,
  };
}

describe("placesForMark", () => {
  const rows = [place("a", "A"), place("b", "B"), place("c", "C")];
  const intents: VisitIntent[] = [
    { placeId: "a", mark: "been", updatedAt: "2026-09-19T00:00:00Z" },
    { placeId: "b", mark: "want", updatedAt: "2026-09-19T00:00:00Z" },
  ];

  it("keeps only the asked private list", () => {
    const marks = marksByPlace(intents);
    expect(placesForMark(rows, marks, "been").map((p) => p.id)).toEqual(["a"]);
    expect(placesForMark(rows, marks, "never")).toEqual([]);
  });

  it("includes Saved (never) on the map with Visited and Next", () => {
    const marks = marksByPlace([
      ...intents,
      { placeId: "c", mark: "never", updatedAt: "2026-09-19T00:00:00Z" },
    ]);
    expect(VISIT_MARK_LABEL).toEqual({ been: "Visited", want: "Next", never: "Saved" });
    expect(placesOnMap(rows, marks, "been").map((p) => p.id)).toEqual(["a"]);
    expect(placesOnMap(rows, marks, "want").map((p) => p.id)).toEqual(["b"]);
    expect(placesOnMap(rows, marks, "never").map((p) => p.id)).toEqual(["c"]);
  });
});
