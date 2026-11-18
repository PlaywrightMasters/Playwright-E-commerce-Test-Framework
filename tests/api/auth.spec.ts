import { expect, test } from '@playwright/test';

// Public demo account from the DummyJSON docs (https://dummyjson.com/docs/auth), not a real credential.
const DEMO_USER = { username: 'emilys', password: 'emilyspass' };

test.describe('Auth API', () => {
  test('POST /auth/login returns tokens for valid credentials', async ({ request }) => {
    const response = await request.post('/auth/login', { data: DEMO_USER });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({
      username: DEMO_USER.username,
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  test('POST /auth/login rejects a wrong password', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: { ...DEMO_USER, password: 'not-the-password' },
    });
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.message).toBe('Invalid credentials');
  });

  test('GET /auth/me returns the user the token belongs to', async ({
    request,
    playwright,
    baseURL,
  }) => {
    const login = await request.post('/auth/login', { data: DEMO_USER });
    expect(login.status()).toBe(200);
    const { accessToken } = await login.json();

    // Login also sets the token as a cookie on `request`. A fresh context carries
    // no cookies, so only the Authorization header can authenticate this call.
    const api = await playwright.request.newContext({ baseURL });
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.username).toBe(DEMO_USER.username);
    await api.dispose();
  });

  test('GET /auth/me rejects a request without a token', async ({ request }) => {
    const response = await request.get('/auth/me');
    expect(response.status()).toBe(401);
  });
});
