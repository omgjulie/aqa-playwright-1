import { test } from "../../../src/fixtures/custom.fixture.js";
import { CUSTOM_PROFILE_DATA } from "./fixtures/profileData.js";
import ProfilePage from "../../../src/pageObjects/profilePage/ProfilePage.js";
import { expect } from "@playwright/test";

test.describe.skip("User profile", () => {
  test("frontend should display replaced profile user name", async ({
    userProfilePage,
  }) => {
    const { page } = userProfilePage;
    await page.route("/api/users/profile", (route) => {
      route.fulfill({ body: JSON.stringify(CUSTOM_PROFILE_DATA) });
    });

    /* 1st option -> await profilePage.navigate(); should be commented in fixture */

    // const profilePage = new ProfilePage(page);
    // await profilePage.navigate();
    //
    // await expect(profilePage.userName).toHaveText(
    //   `${CUSTOM_PROFILE_DATA.data.name} ${CUSTOM_PROFILE_DATA.data.lastName}`,
    // );

    /* 2nd option -> await profilePage.navigate(); should be commented in fixture*/

    await userProfilePage.navigate();

    await expect(userProfilePage.userName).toHaveText(
      `${CUSTOM_PROFILE_DATA.data.name} ${CUSTOM_PROFILE_DATA.data.lastName}`,
    );

    /* 3rd option -> in case, if await profilePage.navigate(); will be uncommented in fixture */

    // await page.reload();
    //
    // await expect(userProfilePage.userName).toHaveText(
    //   `${CUSTOM_PROFILE_DATA.data.name} ${CUSTOM_PROFILE_DATA.data.lastName}`,
    // );
  });
});
