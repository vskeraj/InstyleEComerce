import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';

describe('Auth Service Health Check', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.get('/health', (req, res) => {
      return res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: Date.now(),
      });
    });
  });

  it('should return 200 for health check', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('Basic Unit Test', () => {
  it('should add two numbers correctly', () => {
    const result = 2 + 3;
    expect(result).toBe(5);
  });

  it('should check if array contains item', () => {
    const array = [1, 2, 3, 4, 5];
    expect(array).toContain(3);
  });
});
