import { test, expect } from '@playwright/test';
import { CartPage, Product } from './pages/cartPage';

const APP_URL = 'http://jupiter.cloud.planittesting.com';

// Application URL: http://jupiter.cloud.planittesting.com

const PRODUCTS: Product[] = [
  { name: 'Stuffed Frog', qty: 2, price: 10.99 },
  { name: 'Fluffy Bunny', qty: 5, price: 9.99 },
  { name: 'Valentine Bear', qty: 3, price: 14.99 },
];

function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}

// Run only on chromium to avoid SSL/webkit flakiness in this environment
test.skip(({ browserName }) => browserName !== 'chromium', 'Run only on chromium');

test('Cart subtotals and total are correct', async ({ page }) => {
  const cartPage = new CartPage(page);

  await cartPage.gotoShop();

  for (const product of PRODUCTS) {
    await cartPage.addProductToCart(product.name, product.qty);
  }

  await cartPage.openCart();

  let expectedTotal = 0;
  for (const product of PRODUCTS) {
    const priceText = await cartPage.getProductPrice(product.name);
    const qtyText = await cartPage.getProductQty(product.name);
    const subtotalText = await cartPage.getProductSubtotal(product.name);

    expect(priceText).toBe(fmt(product.price));
    expect(Number(qtyText)).toBe(product.qty);

    const expectedSubtotal = +(product.price * product.qty).toFixed(2);
    expect(subtotalText).toBe(fmt(expectedSubtotal));
    expectedTotal += expectedSubtotal;
  }

  const total = await cartPage.getTotal();
  expect(total).toBe(Number(expectedTotal.toFixed(2)));
});
