import { request, test as base } from "@playwright/test";
import GaragePage from "../pageObjects/garagePage/GaragePage.js";
import { USER_STORAGE_STATE_PATH } from "../data/storageState.js";
import { USERS } from "../data/dict/users.js";
import ProfilePage from "../pageObjects/profilePage/ProfilePage.js";

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

  userInfo: USERS.YULIIA_AQA,
  userProfilePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: USER_STORAGE_STATE_PATH,
    });
    const page = await context.newPage();
    const profilePage = new ProfilePage(page);
    // await profilePage.navigate();

    await use(profilePage);
  },

  userAPIRequest: async ({}, use) => {
    const context = await request.newContext({
      storageState: USER_STORAGE_STATE_PATH,
    });

    await use(context);
  },
});
