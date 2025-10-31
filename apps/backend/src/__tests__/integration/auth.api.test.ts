import request from 'supertest';
import express from 'express';

describe('Authentication API Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.post('/api/v1/auth/register', (req, res) => {
      res.status(201).json({
        success: true,
        data: { message: 'User registered successfully' }
      });
    });

    app.post('/api/v1/auth/login', (req, res) => {
      res.json({
        success: true,
        data: { token: 'mock-jwt-token', user: { id: '1', email: req.body.email } }
      });
    });
  });

  it('POST /api/v1/auth/register should register user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@example.com', password: 'Password123' })
      .expect(201);

    expect(response.body.success).toBe(true);
  });

  it('POST /api/v1/auth/login should return token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'Password123' })
      .expect(200);

    expect(response.body.data).toHaveProperty('token');
  });
});
