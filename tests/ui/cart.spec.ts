import { PASSWORD, PRODUCTS, USERS } from '../../test-data/shop';
import { test } from '../fixtures';

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard, PASSWORD);
    await productsPage.expectLoaded();
  });

  test('adding a product shows it on the cart badge', async ({ productsPage }) => {
    await productsPage.addToCart(PRODUCTS.backpack);

    await productsPage.expectCartCount(1);
  });

  test('badge counts every product added', async ({ productsPage }) => {
    await productsPage.addToCart(PRODUCTS.backpack);
    await productsPage.addToCart(PRODUCTS.bikeLight);

    await productsPage.expectCartCount(2);
  });

  test('removing a product clears the badge', async ({ productsPage }) => {
    await productsPage.addToCart(PRODUCTS.backpack);
    await productsPage.expectCartCount(1);

    await productsPage.removeFromCart(PRODUCTS.backpack);

    await productsPage.expectCartCount(0);
  });

  test('cart lists the products that were added', async ({ productsPage, cartPage }) => {
    await productsPage.addToCart(PRODUCTS.backpack);
    await productsPage.addToCart(PRODUCTS.boltTShirt);
    await productsPage.openCart();

    await cartPage.expectItemCount(2);
    await cartPage.expectItem(PRODUCTS.backpack);
    await cartPage.expectItem(PRODUCTS.boltTShirt);
  });

  test('removing a product in the cart empties it', async ({ productsPage, cartPage }) => {
    await productsPage.addToCart(PRODUCTS.bikeLight);
    await productsPage.openCart();
    await cartPage.expectItem(PRODUCTS.bikeLight);

    await cartPage.removeItem(PRODUCTS.bikeLight);

    await cartPage.expectItemCount(0);
    await productsPage.expectCartCount(0);
  });
});
