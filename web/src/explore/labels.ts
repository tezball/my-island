export const PRICE_LABEL: Record<string, string> = {
  FREE: "Free",
  "1": "€",
  "2": "€€",
  "3": "€€€",
};

export const FACILITY_LABEL: Record<string, string> = {
  parking: "Parking",
  toilets: "Toilets",
  dog_friendly: "Dog friendly",
  accessible: "Accessible",
};

export function priceLabel(band: string | null | undefined): string | null {
  if (!band) return null;
  return PRICE_LABEL[band] ?? band;
}

export function facilityLabel(id: string): string {
  return FACILITY_LABEL[id] ?? id.replaceAll("_", " ");
}
