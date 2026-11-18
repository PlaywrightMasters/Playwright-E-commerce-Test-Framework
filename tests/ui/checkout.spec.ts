import { CUSTOMER, PASSWORD, PRODUCTS, USERS } from '../../test-data/shop';
import { expect, test } from '../fixtures';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard, PASSWORD);
    await productsPage.expectLoaded();
  });

  test('customer can complete an order end to end', async ({
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    const listedPrice = await productsPage.priceOf(PRODUCTS.backpack);
    await productsPage.addToCart(PRODUCTS.backpack);
    await productsPage.openCart();
    await cartPage.expectItem(PRODUCTS.backpack);

    await cartPage.checkout();
    await checkoutPage.fillCustomerInfo(CUSTOMER);
    await checkoutPage.continue();

    // The order overview must charge the price that was shown on the product list.
    await expect(checkoutPage.itemTotal).toHaveText(`Item total: ${listedPrice}`);

    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });

  test('first name is required to continue', async ({ productsPage, cartPage, checkoutPage }) => {
    await productsPage.addToCart(PRODUCTS.backpack);
    await productsPage.openCart();
    await cartPage.checkout();

    await checkoutPage.continue();

    await checkoutPage.expectError('First Name is required');
  });
});
