import { test } from "../../../src/fixtures/userProfilePage.fixture.js";
import { CUSTOM_PROFILE_DATA } from "./fixtures/profileData.js";
import ProfilePage from "../../../src/pageObjects/profilePage/ProfilePage.js";
import { expect } from "@playwright/test";

test.describe("User profile", () => {
  test("frontend should display replaced profile user name", async ({
    userProfilePage,
  }) => {
    const { page } = userProfilePage;
    await page.route("/api/users/profile", (route) => {
      route.fulfill({ body: JSON.stringify(CUSTOM_PROFILE_DATA) });
    });

    const profilePage = new ProfilePage(page);
    await profilePage.navigate();

    await expect(profilePage.userName).toHaveText(
      `${CUSTOM_PROFILE_DATA.data.name} ${CUSTOM_PROFILE_DATA.data.lastName}`,
    );
  });
});
