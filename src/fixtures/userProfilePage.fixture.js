import { test as base } from "@playwright/test";
import { USER_STORAGE_STATE_PATH } from "../data/storageState.js";
import ProfilePage from "../pageObjects/profilePage/ProfilePage.js";
import { USERS } from "../data/dict/users.js";

export const test = base.extend({
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
});
