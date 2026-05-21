import { Page, Locator } from '@playwright/test';

const BASE_SHOP = 'http://jupiter.cloud.planittesting.com/#/shop';
const BASE_CART = 'http://jupiter.cloud.planittesting.com/#/cart';

export type Product = { name: string; qty: number; price: number };

export class CartPage {
  readonly page: Page;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator('a', { hasText: 'Cart' });
  }

  async gotoShop() {
    await this.page.goto(BASE_SHOP);
    await this.page.waitForLoadState('networkidle');
  }

  async addProductToCart(name: string, qty: number) {
    const card = this.page.locator('h4', { hasText: name }).locator('..');
    const buy = card.locator('a:has-text("Buy")');
    for (let i = 0; i < qty; i++) {
      await buy.click();
      await this.page.waitForTimeout(200);
    }
  }

  async openCart() {
    await this.cartLink.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async getProductRow(name: string) {
    return this.page.locator('table tbody tr').filter({ has: this.page.locator('td', { hasText: name }) });
  }

  async getProductPrice(name: string) {
    const row = await this.getProductRow(name);
    return (await row.locator('td').nth(1).innerText()).trim();
  }

  async getProductQty(name: string) {
    const row = await this.getProductRow(name);
    return await row.locator('td').nth(2).locator('input').inputValue().catch(async () => (await row.locator('td').nth(2).innerText()).trim());
  }

  async getProductSubtotal(name: string) {
    const row = await this.getProductRow(name);
    return (await row.locator('td').nth(3).innerText()).trim();
  }

  async getTotal(): Promise<number> {
    const totalLocator = this.page.locator('table tfoot tr td strong');
    if (await totalLocator.count() > 0) {
      const totalText = (await totalLocator.innerText()).trim();
      const m = totalText.match(/(\d+\.\d{1,2})/);
      if (!m) throw new Error(`Unable to parse total from text: ${totalText}`);
      return Number(parseFloat(m[1]).toFixed(2));
    }

    const pageText = await this.page.locator('body').innerText();
    const match = pageText.match(/Total\s*[:\-]?\s*\$?(\d+\.\d{1,2})/i);
    if (!match) throw new Error('Unable to locate total on cart page');
    return Number(parseFloat(match[1]).toFixed(2));
  }
}
