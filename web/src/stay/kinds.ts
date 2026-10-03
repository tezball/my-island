export const STAY_KINDS = [
  "campsite",
  "bed and breakfast",
  "apartment",
  "glamping",
  "lodge",
] as const;

export type StayKind = (typeof STAY_KINDS)[number];

export const WIZARD_STEPS = [
  "kind",
  "title",
  "description",
  "images",
  "cost",
  "phone",
  "email",
  "website",
  "location",
] as const;
