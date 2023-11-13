import BasePage from "../BasePage.js";
import { expect } from "@playwright/test";

export default class WelcomePage extends BasePage {
  constructor(page) {
    super(page, "/", page.locator("button", { hasText: "Guest log in" }));
  }
  async openRegistrationPage() {
    const signUpButton = this._page.locator("button.hero-descriptor_btn");
    await signUpButton.click();

    const signUpModal = this._page.locator("div.modal-content");
    await expect(
      signUpModal,
      "Sign up modal page should be visible",
    ).toBeVisible();
  }
}
