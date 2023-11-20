import { test as base } from "@playwright/test";
import GaragePage from "../pageObjects/garagePage/GaragePage.js";
import { USER_STORAGE_STATE_PATH } from "../data/storageState.js";

export const test = base.extend({
  userGaragePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: USER_STORAGE_STATE_PATH,
    });
    const page = await context.newPage();
    const garagePage = new GaragePage(page);
    await garagePage.navigate();

    await use(garagePage);
  },
});
