import { request, test as base } from "@playwright/test";
import { USER_STORAGE_STATE_PATH } from "../data/storageState.js";

export const test = base.extend({
  userAPIRequest: async ({}, use) => {
    const context = await request.newContext({
      storageState: USER_STORAGE_STATE_PATH,
    });

    await use(context);
  },
});
