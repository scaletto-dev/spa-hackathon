import request from 'supertest';
import express from 'express';

// Simple health check test
describe('Health Check API', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.get('/api/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Beauty Clinic Care API',
        version: '1.0.0'
      });
    });
  });

  describe('GET /api/health', () => {
    it('should return 200 OK status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('service');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return valid JSON', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/);

      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('object');
    });

    it('should include service name', async () => {
      const response = await request(app).get('/api/health');

      expect(response.body.service).toBe('Beauty Clinic Care API');
    });
  });
});
