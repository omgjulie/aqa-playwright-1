import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import WelcomePage from "../../src/pageObjects/welcomePage/WelcomePage.js";
import RegistrationPage from "../../src/pageObjects/registrationPage/RegistrationPage.js";

test.describe("Sign up modal", () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();

    page = await context.newPage();
  });

  test.beforeEach(async () => {
    const welcomePage = new WelcomePage(page);

    await welcomePage.open();
    await welcomePage.waitLoaded();
    await welcomePage.openRegistrationPage();
  });

  test("All fields are mandatory @regression", async () => {
    const registration = new RegistrationPage(page);

    const emptyData = ["", "", "", "", ""];

    await registration.fill(emptyData);

    const expectedErrorText = [
      "Name required",
      "Last name required",
      "Email required",
      "Password required",
      "Re-enter password required",
    ];

    const errorMessageText = await registration.getErrorText();
    await expect(errorMessageText).toEqual(expectedErrorText);

    for (const inputItem of await registration.signUpInput.all()) {
      await expect(inputItem).toHaveCSS("border-color", "rgb(220, 53, 69)");
    }

    await expect(registration.registerButton).toBeDisabled();
  });

  test("Validation of inputs @regression", async () => {
    const registration = new RegistrationPage(page);

    const invalidData = ["6", "6", "etdf@f", "4", "6", "7"];

    await registration.fill(invalidData);

    const expectedErrorText = [
      "Name is invalid",
      "Name has to be from 2 to 20 characters long",
      "Last name is invalid",
      "Last name has to be from 2 to 20 characters long",
      "Email is incorrect",
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter",
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter",
    ];

    const errorMessageText = await registration.getErrorText();
    await expect(errorMessageText).toEqual(expectedErrorText);

    await expect(registration.registerButton).toBeDisabled();
  });

  test.skip("Create user with valid data @smoke @regression", async () => {
    const registration = new RegistrationPage(page);

    const firsName = faker.person.firstName({ sex: "female" });
    const lastName = faker.person.lastName();
    const email = faker.internet.exampleEmail({ firstName: "AQA" });
    const password = faker.internet.password({ length: 10, prefix: "Aqa1" });

    const validData = [firsName, lastName, email, password, password];

    await registration.fill(validData);

    await expect(registration.registerButton).toBeEnabled();
    await registration.registerButton.click();

    await expect(page).toHaveURL("panel/garage");
  });
});
