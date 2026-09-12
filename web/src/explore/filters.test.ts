import { describe, expect, it } from "vitest";
import { applyFilters, inBounds, parseCsv } from "./filters";
import type { Place } from "../api/catalog";

function place(partial: Partial<Place> & { slug: string; name: string }): Place {
  return {
    id: partial.slug,
    description: null,
    category: { id: "poi", label: "Point of interest" },
    county: { id: "kerry", name: "Kerry" },
    town: "Killarney",
    latitude: 52.0,
    longitude: -9.5,
    published: true,
    priceBand: "FREE",
    website: null,
    phone: null,
    facilities: [],
    imageUrl: null,
    imageCredit: null,
    imageLicence: null,
    ...partial,
  };
}

describe("parseCsv", () => {
  it("splits counties", () => {
    expect(parseCsv("kerry,cork")).toEqual(["kerry", "cork"]);
  });
});

describe("applyFilters", () => {
  const rows = [
    place({ slug: "torc", name: "Torc Waterfall", county: { id: "kerry", name: "Kerry" } }),
    place({
      slug: "howth",
      name: "Howth Head",
      county: { id: "dublin", name: "Dublin" },
      town: "Howth",
      latitude: 53.38,
      longitude: -6.06,
    }),
  ];

  it("filters by county and search", () => {
    const found = applyFilters(rows, { q: "howth", county: ["dublin"] }, null);
    expect(found.map((p) => p.slug)).toEqual(["howth"]);
  });

  it("drops non-poi", () => {
    const campsite = place({
      slug: "camp",
      name: "A Camp",
      category: { id: "campsite", label: "Campsite" },
    });
    const found = applyFilters([...rows, campsite], { q: "", county: [] }, null);
    expect(found.some((p) => p.slug === "camp")).toBe(false);
  });

  it("keeps points inside a bbox", () => {
    expect(inBounds(rows[1], { west: -7, south: 53, east: -6, north: 54 })).toBe(true);
    expect(inBounds(rows[0], { west: -7, south: 53, east: -6, north: 54 })).toBe(false);
  });
});
