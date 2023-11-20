import { test } from "@playwright/test";
import WelcomePage from "../../src/pageObjects/welcomePage/WelcomePage.js";
import { USERS } from "../../src/data/dict/users.js";
import { USER_STORAGE_STATE_PATH } from "../../src/data/storageState.js";

test("login as user and storage state saving", async ({ page, context }) => {
  const welcomePage = new WelcomePage(page);
  await welcomePage.navigate();
  const popup = await welcomePage.openSignInPopup();
  await popup.signIn({
    email: USERS.YULIIA_AQA.email,
    password: USERS.YULIIA_AQA.password,
  });

  await context.storageState({
    path: USER_STORAGE_STATE_PATH,
  });
});
