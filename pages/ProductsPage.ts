import { type Locator, type Page, expect } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/** The product listing shown after login, plus the header it shares with other pages. */
export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async expectLoaded() {
    await expect(this.title).toHaveText('Products');
  }

  /** The product card whose name matches exactly, e.g. "Sauce Labs Backpack". */
  item(productName: string): Locator {
    return this.items.filter({ has: this.page.getByText(productName, { exact: true }) });
  }

  async addToCart(productName: string) {
    await this.item(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName: string) {
    await this.item(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  /** The badge is removed from the page when the cart is empty, so 0 means "not shown". */
  async expectCartCount(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).toBeHidden();
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async productNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  /** Prices in display order, as numbers ("$29.99" -> 29.99). */
  async productPrices(): Promise<number[]> {
    const labels = await this.itemPrices.allTextContents();
    return labels.map((label) => Number(label.replace('$', '')));
  }

  /** The price label on one product card, e.g. "$29.99". */
  async priceOf(productName: string): Promise<string> {
    return this.item(productName).getByTestId('inventory-item-price').innerText();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
