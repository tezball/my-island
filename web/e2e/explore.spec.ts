import { expect, test } from "@playwright/test";

test("explore shell loads on the public test host", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Explore/i })).toBeVisible();
});
