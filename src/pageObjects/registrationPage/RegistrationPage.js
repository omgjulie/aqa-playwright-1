import BasePage from "../BasePage.js";
import { expect } from "@playwright/test";

export default class RegistrationPage extends BasePage {
  constructor(page) {
    super(page, "/", page.locator("app-signup-modal"));

    this.nameInput = this._container.locator("input#signupName");
    this.lastNameInput = this._container.locator("input#signupLastName");
    this.emailInput = this._container.locator("input#signupEmail");
    this.passwordInput = this._container.locator("input#signupPassword");
    this.repeatPasswordInput = this._container.locator(
      "input#signupRepeatPassword",
    );
    this.registerButton = this._container.locator(
      ".modal-footer button.btn-primary",
    );
    this.errorMessage = this._container.locator("div.invalid-feedback p");
    this.signUpInput = this._container.locator(".form-group input");
  }

  async getErrorText() {
    const actualErrorText = [];

    for (const errorTextItem of await this.errorMessage.all()) {
      actualErrorText.push(await errorTextItem.innerText());
    }

    return actualErrorText;
  }

  async fill(data) {
    const count = await this.signUpInput.count();
    for (let i = 0; i < count; i++) {
      await this.signUpInput.nth(i).fill(data[i]);
    }

    await this.signUpInput.last().blur();
  }
}
