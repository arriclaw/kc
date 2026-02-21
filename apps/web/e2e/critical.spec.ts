import { test, expect } from "@playwright/test";

test("landing renders CTAs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Historial verificable de tu vehículo")).toBeVisible();
  await expect(page.getByRole("link", { name: "Registrar mi vehículo" })).toBeVisible();
});
