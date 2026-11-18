# Playwright E-commerce Test Framework

UI and API test automation for an e-commerce flow, built with **Playwright** and **TypeScript**, structured with the **Page Object Model**, and run on every push by **GitHub Actions**.

- **UI under test:** [SauceDemo](https://www.saucedemo.com), a public demo shop
- **API under test:** [DummyJSON](https://dummyjson.com), a public practice API with products and auth endpoints

## What it covers

| Suite | File | Covers |
|---|---|---|
| Login | `tests/ui/login.spec.ts` | Valid login, locked-out user, wrong password, missing password, logout, blocked access without login |
| Products | `tests/ui/products.spec.ts` | Catalogue size, sort by price, sort by name |
| Cart | `tests/ui/cart.spec.ts` | Cart badge count, removing products, cart contents |
| Checkout | `tests/ui/checkout.spec.ts` | Full purchase flow with price check, required-field validation |
| Products API | `tests/api/products.spec.ts` | GET one, pagination, category filter, POST, PUT, DELETE, 404 |
| Auth API | `tests/api/auth.spec.ts` | Login, wrong password, token-protected endpoint with and without a token |

UI tests run in Chromium, Firefox and WebKit. API tests run once, without a browser.

## Project structure

```
├── .github/workflows/playwright.yml   # CI pipeline
├── pages/                             # Page Object classes
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── test-data/
│   └── shop.ts                        # users, product names, customer details
├── tests/
│   ├── fixtures.ts                    # injects page objects into tests
│   ├── ui/                            # browser tests
│   └── api/                           # HTTP tests, no browser
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Getting started

Requires Node.js 20 or newer.

```bash
npm install               # install dependencies
npx playwright install    # download the browsers Playwright drives
```

## Running tests

| Command | What it runs |
|---|---|
| `npm test` | Everything: API tests plus UI tests in all three browsers |
| `npm run test:ui` | UI tests only, all browsers |
| `npm run test:api` | API tests only |
| `npm run test:chromium` | UI tests in Chromium only |
| `npm run test:headed` | UI tests with a visible browser window |
| `npm run test:debug` | Step through tests in the Playwright Inspector |
| `npm run report` | Open the HTML report from the last run |
| `npm run typecheck` | Type-check the project with `tsc` |

A failing UI test saves a screenshot and a video under `test-results/`. In CI, a test that fails and is retried also records a trace.

## How it is organised

**Page objects** (`pages/`) hold the locators and actions for one screen each, so a selector change is fixed in one place. Locators use `getByTestId()`, which is configured in `playwright.config.ts` to read SauceDemo's `data-test` attribute.

**Fixtures** (`tests/fixtures.ts`) extend Playwright's `test` so a spec receives ready-made page objects as arguments:

```ts
test('adding a product shows it on the cart badge', async ({ productsPage }) => {
  await productsPage.addToCart('Sauce Labs Backpack');
  await productsPage.expectCartCount(1);
});
```

**Projects** (`playwright.config.ts`) split the run in four: `api`, `chromium`, `firefox` and `webkit`. Each project sets its own `baseURL`, so tests use relative paths such as `page.goto('/')` and `request.get('/products/1')`.

**Test data** (`test-data/shop.ts`) keeps usernames and product names out of the specs. The accounts used are the public demo accounts published by SauceDemo and DummyJSON.

## Continuous integration

`.github/workflows/playwright.yml` runs on every push and pull request to `main`. It installs dependencies and browsers, type-checks the project, runs the full suite with two retries, and uploads the HTML report as an artifact that is kept for 14 days.

## Notes

- Both sites are third-party demos. If one is down or changes its content, tests fail for reasons unrelated to this code.
- DummyJSON simulates writes: POST, PUT and DELETE respond as if they succeeded but store nothing, which keeps the API tests repeatable.
