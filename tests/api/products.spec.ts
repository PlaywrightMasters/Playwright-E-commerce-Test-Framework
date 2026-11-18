import { expect, test } from '@playwright/test';

/**
 * API tests against DummyJSON (https://dummyjson.com), a public practice API.
 * No browser is launched: the `request` fixture sends plain HTTP calls.
 * DummyJSON simulates writes, so POST/PUT/DELETE respond as if they succeeded
 * but nothing is stored, which keeps these tests repeatable.
 */
test.describe('Products API', () => {
  test('GET /products/1 returns a single product', async ({ request }) => {
    const response = await request.get('/products/1');
    expect(response.status()).toBe(200);

    const product = await response.json();
    expect(product).toMatchObject({
      id: 1,
      title: expect.any(String),
      price: expect.any(Number),
    });
  });

  test('GET /products pages through the catalogue with limit and skip', async ({ request }) => {
    const response = await request.get('/products', { params: { limit: 5, skip: 10 } });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({ limit: 5, skip: 10 });
    expect(body.products).toHaveLength(5);
    expect(body.products[0].id).toBe(11); // the first 10 products were skipped
    expect(body.total).toBeGreaterThan(15);
  });

  test('GET /products/category/smartphones returns only that category', async ({ request }) => {
    const response = await request.get('/products/category/smartphones');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.products.length).toBeGreaterThan(0);
    for (const product of body.products) {
      expect(product.category).toBe('smartphones');
    }
  });

  test('POST /products/add creates a product', async ({ request }) => {
    const newProduct = { title: 'Trail Running Backpack', price: 49.99, category: 'sports-accessories' };

    const response = await request.post('/products/add', { data: newProduct });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject(newProduct);
    expect(body.id).toEqual(expect.any(Number));
  });

  test('PUT /products/1 updates a product', async ({ request }) => {
    const response = await request.put('/products/1', { data: { price: 19.5 } });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({ id: 1, price: 19.5 });
  });

  test('DELETE /products/1 marks the product as deleted', async ({ request }) => {
    const response = await request.delete('/products/1');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({ id: 1, isDeleted: true });
  });

  test('GET /products/99999 returns 404 for an unknown product', async ({ request }) => {
    const response = await request.get('/products/99999');
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.message).toContain('not found');
  });
});
