import { describe, expect, it } from "vitest";
import { formatKm, hasCoords, haversineKm } from "./geo";

describe("haversineKm", () => {
  it("is about 0 for the same point", () => {
    expect(haversineKm(53.4, -8.2, 53.4, -8.2)).toBeCloseTo(0, 5);
  });

  it("is about 185km Dublin to Galway", () => {
    const km = haversineKm(53.35, -6.26, 53.27, -9.05);
    expect(km).toBeGreaterThan(170);
    expect(km).toBeLessThan(220);
  });
});

describe("hasCoords", () => {
  it("rejects nulls and zeros", () => {
    expect(hasCoords({ latitude: null, longitude: null })).toBe(false);
    expect(hasCoords({ latitude: 0, longitude: 0 })).toBe(false);
    expect(hasCoords({ latitude: 53.4, longitude: -8.2 })).toBe(true);
  });
});

describe("formatKm", () => {
  it("uses one decimal under 10", () => {
    expect(formatKm(1.23)).toBe("1.2 km");
    expect(formatKm(12.4)).toBe("12 km");
  });
});
