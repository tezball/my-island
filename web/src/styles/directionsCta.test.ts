import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type Declaration = { selector: string; value: string; specificity: number; order: number };

function specificity(selector: string): number {
  const ids = (selector.match(/#[\w-]+/g) ?? []).length;
  const classes = (selector.match(/\.[\w-]+/g) ?? []).length;
  const elements = selector
    .replace(/#[\w-]+/g, " ")
    .replace(/\.[\w-]+/g, " ")
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/::?[\w-]+(\([^)]*\))?/g, " ")
    .split(/[\s>+~]+/)
    .filter((part) => part && part !== "*").length;
  return ids * 100 + classes * 10 + elements;
}

function matchesDirections(selector: string): boolean {
  const normalized = selector.trim().replace(/\s+/g, " ");
  return (
    normalized === ".primary" ||
    normalized === "a.primary" ||
    normalized === ".sticky-actions .primary" ||
    normalized === ".sticky-actions a.primary"
  );
}

function token(css: string, name: string): string {
  const value = new RegExp(`${name}\\s*:\\s*(#[0-9a-fA-F]{3,8})`).exec(css)?.[1];
  if (!value) throw new Error(`missing ${name}`);
  return value.toLowerCase();
}

function resolveColor(css: string, raw: string): string {
  const value = raw.trim().toLowerCase();
  const variable = /^var\(\s*(--[\w-]+)\s*\)$/.exec(value);
  return variable ? token(css, variable[1]) : value;
}

function directionsBackground(css: string): string | undefined {
  const declarations: Declaration[] = [];
  const blocks = css.matchAll(/([^{}]+)\{([^{}]*)\}/g);
  let order = 0;
  for (const block of blocks) {
    const selectors = block[1]
      .split(",")
      .map((selector) => selector.trim())
      .filter((selector) => selector && !selector.includes("@"));
    const declared = /(?:^|;)\s*background\s*:\s*([^;]+)/.exec(block[2])?.[1];
    if (!declared) continue;
    for (const selector of selectors) {
      if (!matchesDirections(selector)) continue;
      declarations.push({
        selector,
        value: resolveColor(css, declared),
        specificity: specificity(selector),
        order: order++,
      });
    }
  }
  declarations.sort((a, b) => a.specificity - b.specificity || a.order - b.order);
  return declarations.at(-1)?.value;
}

describe("Directions call to action", () => {
  it("uses amber #f5a524", () => {
    const css = readFileSync(new URL("./app.css", import.meta.url), "utf8");
    expect(css.toLowerCase()).not.toContain("#c98400");
    expect(token(css, "--amber")).toBe("#f5a524");
    expect(directionsBackground(css)).toBe("#f5a524");
  });
});
