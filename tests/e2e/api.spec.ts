import { test, expect } from '@playwright/test';

test.describe('InstyleEComerce API E2E Tests', () => {
  const API_BASE_URL = 'http://localhost:80';

  test.beforeEach(async ({ request }) => {
    // Setup test data if needed
  });

  test('Health check endpoints', async ({ request }) => {
    // Test API Gateway health
    const gatewayHealth = await request.get(`${API_BASE_URL}/health`);
    expect(gatewayHealth.status()).toBe(200);
    expect(await gatewayHealth.text()).toContain('healthy');

    // Test individual service health
    const authHealth = await request.get(`${API_BASE_URL}/api/v1/auth/health`);
    expect(authHealth.status()).toBe(200);
    
    const ordersHealth = await request.get(`${API_BASE_URL}/api/v1/orders/health`);
    expect(ordersHealth.status()).toBe(200);
  });

  test('User authentication flow', async ({ request }) => {
    // Test user registration (if endpoint exists)
    const registerResponse = await request.post(`${API_BASE_URL}/api/v1/auth/register`, {
      data: {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    
    // Test user login
    const loginResponse = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    
    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();
    expect(loginData).toHaveProperty('token');
  });

  test('Order management flow', async ({ request }) => {
    // Create an order
    const createOrderResponse = await request.post(`${API_BASE_URL}/api/v1/orders/`, {
      headers: {
        'Authorization': 'Bearer valid-token-here'
      },
      data: {
        items: [
          { productId: 'prod-1', quantity: 2, price: 29.99 },
          { productId: 'prod-2', quantity: 1, price: 49.99 }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          zipCode: '12345',
          country: 'US'
        }
      }
    });
    
    expect(createOrderResponse.status()).toBe(201);
    const orderData = await createOrderResponse.json();
    expect(orderData).toHaveProperty('orderId');
    
    // Get order details
    const orderDetailsResponse = await request.get(`${API_BASE_URL}/api/v1/orders/${orderData.orderId}`, {
      headers: {
        'Authorization': 'Bearer valid-token-here'
      }
    });
    
    expect(orderDetailsResponse.status()).toBe(200);
    const orderDetails = await orderDetailsResponse.json();
    expect(orderDetails.orderId).toBe(orderData.orderId);
  });

  test('Product catalog flow', async ({ request }) => {
    // Get all products
    const productsResponse = await request.get(`${API_BASE_URL}/api/v1/products/`);
    expect(productsResponse.status()).toBe(200);
    
    const productsData = await productsResponse.json();
    expect(Array.isArray(productsData.products)).toBe(true);
    
    // Get specific product
    if (productsData.products.length > 0) {
      const productId = productsData.products[0].id;
      const productResponse = await request.get(`${API_BASE_URL}/api/v1/products/${productId}`);
      expect(productResponse.status()).toBe(200);
      
      const productData = await productResponse.json();
      expect(productData.id).toBe(productId);
    }
  });

  test('Payment processing flow', async ({ request }) => {
    // Process payment
    const paymentResponse = await request.post(`${API_BASE_URL}/api/v1/payments/`, {
      headers: {
        'Authorization': 'Bearer valid-token-here'
      },
      data: {
        orderId: 'order-123',
        amount: 109.97,
        currency: 'USD',
        paymentMethod: 'credit_card',
        cardDetails: {
          number: '4111111111111111',
          expiryMonth: '12',
          expiryYear: '2025',
          cvv: '123'
        }
      }
    });
    
    expect(paymentResponse.status()).toBe(200);
    const paymentData = await paymentResponse.json();
    expect(paymentData).toHaveProperty('paymentId');
    expect(paymentData.status).toBe('completed');
  });

  test('Error handling', async ({ request }) => {
    // Test 404 error
    const notFoundResponse = await request.get(`${API_BASE_URL}/api/v1/nonexistent`);
    expect(notFoundResponse.status()).toBe(404);
    
    // Test unauthorized access
    const unauthorizedResponse = await request.get(`${API_BASE_URL}/api/v1/orders/secret`);
    expect(unauthorizedResponse.status()).toBe(401);
    
    // Test validation error
    const validationErrorResponse = await request.post(`${API_BASE_URL}/api/v1/orders/`, {
      headers: {
        'Authorization': 'Bearer valid-token-here'
      },
      data: {
        items: 'invalid-data'
      }
    });
    expect(validationErrorResponse.status()).toBe(400);
  });

  test('Rate limiting', async ({ request }) => {
    // Make multiple rapid requests to test rate limiting
    const promises = Array(25).fill(null).map(() => 
      request.get(`${API_BASE_URL}/api/v1/products/`)
    );
    
    const responses = await Promise.all(promises);
    const rateLimitedResponses = responses.filter(response => response.status() === 429);
    
    // Should have at least some rate limited responses
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });
});
