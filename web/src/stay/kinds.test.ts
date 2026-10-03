import { expect, test } from "vitest";
import { STAY_KINDS, WIZARD_STEPS } from "./kinds";

test("Stay kinds and wizard steps use the locked words", () => {
  expect(STAY_KINDS).toEqual([
    "campsite",
    "bed and breakfast",
    "apartment",
    "glamping",
    "lodge",
  ]);
  expect(WIZARD_STEPS).toEqual([
    "kind",
    "title",
    "description",
    "images",
    "cost",
    "phone",
    "email",
    "website",
    "location",
  ]);
});
