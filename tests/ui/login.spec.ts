import { PASSWORD, USERS } from '../../test-data/shop';
import { expect, test } from '../fixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user lands on the products page', async ({ page, loginPage, productsPage }) => {
    await loginPage.login(USERS.standard, PASSWORD);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await productsPage.expectLoaded();
  });

  test('locked out user is refused', async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut, PASSWORD);

    await loginPage.expectError('Sorry, this user has been locked out');
  });

  test('wrong password is refused', async ({ loginPage }) => {
    await loginPage.login(USERS.standard, 'not-the-password');

    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('password is required', async ({ loginPage }) => {
    await loginPage.usernameInput.fill(USERS.standard);
    await loginPage.loginButton.click();

    await loginPage.expectError('Password is required');
  });

  test('logged-in user can log out', async ({ page, loginPage, productsPage }) => {
    await loginPage.login(USERS.standard, PASSWORD);
    await productsPage.expectLoaded();

    await productsPage.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('products page is not reachable without logging in', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await loginPage.expectError("You can only access '/inventory.html' when you are logged in");
  });
});
