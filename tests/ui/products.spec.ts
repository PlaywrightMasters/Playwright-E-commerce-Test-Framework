import { PASSWORD, USERS } from '../../test-data/shop';
import { expect, test } from '../fixtures';

test.describe('Product listing', () => {
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard, PASSWORD);
    await productsPage.expectLoaded();
  });

  test('shows the full catalogue', async ({ productsPage }) => {
    await expect(productsPage.items).toHaveCount(6);
  });

  test('sorts by price, low to high', async ({ productsPage }) => {
    const defaultOrder = await productsPage.productPrices();
    const sorted = [...defaultOrder].sort((a, b) => a - b);
    // Guards against a vacuous pass: the default order must not already be sorted by price.
    expect(defaultOrder).not.toEqual(sorted);

    await productsPage.sortBy('lohi');

    await expect.poll(() => productsPage.productPrices()).toEqual(sorted);
  });

  test('sorts by name, Z to A', async ({ productsPage }) => {
    const defaultOrder = await productsPage.productNames();
    const reversed = [...defaultOrder].sort().reverse();
    expect(defaultOrder).not.toEqual(reversed);

    await productsPage.sortBy('za');

    await expect(productsPage.itemNames).toHaveText(reversed);
  });
});
