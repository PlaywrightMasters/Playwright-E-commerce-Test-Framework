import { type Locator, type Page, expect } from '@playwright/test';

/** The shopping cart page. */
export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  item(productName: string): Locator {
    return this.items.filter({ has: this.page.getByText(productName, { exact: true }) });
  }

  async expectItem(productName: string) {
    await expect(this.item(productName)).toBeVisible();
  }

  async expectItemCount(count: number) {
    await expect(this.items).toHaveCount(count);
  }

  async removeItem(productName: string) {
    await this.item(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
