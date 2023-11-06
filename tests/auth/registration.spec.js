import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  const signUpButton = page.locator("button.hero-descriptor_btn");
  await signUpButton.click();

  const signUpModal = page.locator("div.modal-content");
  await expect(
    signUpModal,
    "Sign up modal page should be visible",
  ).toBeVisible();
});

test.describe("Registration", async () => {
  test.skip("All fields are mandatory", async ({ page }) => {
    const nameInput = page.locator("input#signupName");
    const lastNameInput = page.locator("input#signupLastName");
    const emailInput = page.locator("input#signupEmail");
    const passwordInput = page.locator("input#signupPassword");
    const repeatPasswordInput = page.locator("input#signupRepeatPassword");
    const registerButton = page.locator(".modal-footer button.btn-primary");
    const errorMessageInput = page.locator("div.invalid-feedback p");
    const signUpInput = page.locator(".form-group input");

    await nameInput.click();
    await lastNameInput.click();
    await emailInput.click();
    await passwordInput.click();
    await repeatPasswordInput.click();
    await passwordInput.click();

    const expectedErrorText = [
      "Name required",
      "Last name required",
      "Email required",
      "Password required",
      "Re-enter password required",
    ];

    const actualErrorText = [];

    for (const errorTextItem of await errorMessageInput.all()) {
      actualErrorText.push(await errorTextItem.innerText());
    }

    await expect(actualErrorText).toEqual(expectedErrorText);

    for (const inputItem of await signUpInput.all()) {
      await expect(inputItem).toHaveCSS("border-color", "rgb(220, 53, 69)");
    }

    await expect(registerButton).toBeDisabled();
  });

  test.skip("Input validation", async ({ page }) => {
    const nameInput = page.locator("input#signupName");
    const lastNameInput = page.locator("input#signupLastName");
    const emailInput = page.locator("input#signupEmail");
    const passwordInput = page.locator("input#signupPassword");
    const repeatPasswordInput = page.locator("input#signupRepeatPassword");
    const registerButton = page.locator(".modal-footer button.btn-primary");
    const errorMessageInput = page.locator("div.invalid-feedback p");

    await nameInput.fill("6");
    await lastNameInput.fill("6");
    await emailInput.fill("etdf@f");
    await passwordInput.fill("4");
    await repeatPasswordInput.fill("6");
    await passwordInput.click();

    const expectedErrorText = [
      "Name is invalid",
      "Name has to be from 2 to 20 characters long",
      "Last name is invalid",
      "Last name has to be from 2 to 20 characters long",
      "Email is incorrect",
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter",
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter",
    ];

    const actualErrorText = [];

    for (const errorTextItem of await errorMessageInput.all()) {
      actualErrorText.push(await errorTextItem.innerText());
    }

    await expect(actualErrorText).toEqual(expectedErrorText);

    await expect(registerButton).toBeDisabled();
  });

  test("Create user with valid data", async ({ page }) => {
    const nameInput = page.locator("input#signupName");
    const lastNameInput = page.locator("input#signupLastName");
    const emailInput = page.locator("input#signupEmail");
    const passwordInput = page.locator("input#signupPassword");
    const repeatPasswordInput = page.locator("input#signupRepeatPassword");
    const registerButton = page.locator(".modal-footer button.btn-primary");

    const firsName = faker.person.firstName({ sex: "female" });
    const lastName = faker.person.lastName();
    const email = faker.internet.exampleEmail({ firstName: "AQA" });
    const password = faker.internet.password({ length: 10, prefix: "Aqa1" });

    await nameInput.fill(firsName);
    await lastNameInput.fill(lastName);
    await emailInput.fill(email);
    await passwordInput.fill(password);
    await repeatPasswordInput.fill(password);

    await expect(registerButton).toBeEnabled();
    await registerButton.click();

    await expect(page).toHaveURL("panel/garage");
  });
});
