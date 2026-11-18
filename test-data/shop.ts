/**
 * Test data for the SauceDemo shop.
 * These are the public demo accounts printed on the SauceDemo login page, not real credentials.
 */
export const PASSWORD = 'secret_sauce';

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
} as const;

export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
} as const;

export const CUSTOMER = {
  firstName: 'Asha',
  lastName: 'Rao',
  postalCode: '500081',
} as const;
