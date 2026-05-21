import { Page, Locator } from '@playwright/test';

const CONTACT_URL = 'https://jupiter.cloud.planittesting.com/#/contact';

export class ContactPage {
  readonly page: Page;
  readonly submitButton: Locator;
  readonly forenameError: Locator;
  readonly emailError: Locator;
  readonly messageError: Locator;
  readonly forenameInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.locator('a.btn-contact:has-text("Submit")');
    this.forenameError = page.locator('text=Forename is required');
    this.emailError = page.locator('text=Email is required');
    this.messageError = page.locator('text=Message is required');
    this.forenameInput = page.locator('#forename');
    this.emailInput = page.locator('#email');
    this.messageInput = page.locator('#message');
    this.successMessage = page.locator('div.alert-success');
  }

  async goto() {
    await this.page.goto(CONTACT_URL);
    await this.page.waitForLoadState('networkidle');
  }

  async submitEmpty() {
    await this.submitButton.click();
  }

  async fillMandatoryFields(forename: string, email: string, message: string) {
    await this.forenameInput.fill(forename);
    await this.emailInput.fill(email);
    await this.messageInput.fill(message);
    await this.messageInput.blur();
  }

  async submit() {
    await this.submitButton.click();
  }
}
