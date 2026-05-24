/**
 * Test Case 2: Contact Form - Successful Submission
 * Application URL: http://jupiter.cloud.planittesting.com
 * 
 * Steps:
 * 1. Navigate to contact page via page object
 * 2. Populate mandatory fields
 * 3. Submit the form
 * 4. Validate submission success message
 * 5. Run this test 5 times to ensure 100% pass rate
 * 
 * Run command: 
 * npx playwright test "Test case 2.spec.ts" --repeat-each=5 --workers=1
 */

import { test, expect } from '@playwright/test';
import { ContactPage } from './tests/pages/contactPage';

const APP_URL = 'http://jupiter.cloud.planittesting.com';

for (let i = 1; i <= 5; i++) {

  test(`Test Case 2 - Run ${i}`, async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();

    await contactPage.fillMandatoryFields(
      'Sarah Johnson',
      'sarah.johnson@example.com',
      'Excellent customer service and quality products. Highly recommend!'
    );

    await contactPage.submit();

    await expect(contactPage.successMessage).toBeVisible({ timeout: 20000 });

    await expect(contactPage.page.locator('text=« Back')).toBeVisible();
  });

}