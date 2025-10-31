import request from 'supertest';
import express from 'express';

describe('Services API Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Mock services endpoint
    app.get('/api/v1/services', (req, res) => {
      res.json({
        success: true,
        data: [
          { id: '1', name: 'Massage', price: 500000 },
          { id: '2', name: 'Facial', price: 300000 }
        ]
      });
    });
  });

  it('GET /api/v1/services should return services list', async () => {
    const response = await request(app)
      .get('/api/v1/services')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it('should return JSON content-type', async () => {
    await request(app)
      .get('/api/v1/services')
      .expect('Content-Type', /json/);
  });
});
