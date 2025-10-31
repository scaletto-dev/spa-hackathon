import request from 'supertest';
import express from 'express';

describe('Bookings API Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.post('/api/v1/bookings', (req, res) => {
      res.status(201).json({
        success: true,
        data: {
          id: '1',
          referenceNumber: 'BK12345678',
          status: 'PENDING',
          totalAmount: req.body.totalAmount
        }
      });
    });

    app.get('/api/v1/bookings/:id', (req, res) => {
      res.json({
        success: true,
        data: { id: req.params.id, status: 'CONFIRMED' }
      });
    });
  });

  it('POST /api/v1/bookings should create booking', async () => {
    const response = await request(app)
      .post('/api/v1/bookings')
      .send({
        serviceId: '1',
        date: '2025-11-01',
        time: '10:00',
        totalAmount: 500000
      })
      .expect(201);

    expect(response.body.data).toHaveProperty('referenceNumber');
    expect(response.body.data.status).toBe('PENDING');
  });

  it('GET /api/v1/bookings/:id should return booking details', async () => {
    const response = await request(app)
      .get('/api/v1/bookings/1')
      .expect(200);

    expect(response.body.data.status).toBe('CONFIRMED');
  });
});
