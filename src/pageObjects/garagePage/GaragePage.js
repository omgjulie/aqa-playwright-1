import BasePage from "../BasePage.js";

export default class GaragePage extends BasePage {
  constructor(page) {
    super(
      page,
      "/panel/garage",
      page.locator("button#userNavDropdown", { hasText: " My profile " }),
    );
    this.title = page.locator(".panel-page_heading h1");
  }
}
