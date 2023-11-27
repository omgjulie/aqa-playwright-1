import { test } from "../../../src/fixtures/userGaragePage.fixture.js";
import { expect } from "@playwright/test";
import GaragePage from "../../../src/pageObjects/garagePage/GaragePage.js";

test.describe("Garage page", () => {
  test("page has title", async ({ userGaragePage }) => {
    await userGaragePage.navigate();

    const { page } = userGaragePage;
    const garagePage = new GaragePage(page);
    await expect(garagePage.title).toHaveText("Garage");
  });
});
