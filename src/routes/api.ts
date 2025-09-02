import { Elysia } from 'elysia';

export const apiRoutes = new Elysia({ prefix: '/api/v1' })
  .get('/', () => ({
    message: 'AirWhere API v1',
    endpoints: [
      'GET /api/v1/locations',
      'GET /api/v1/weather',
      'POST /api/v1/reports',
    ],
  }))
  .get('/locations', () => ({
    message: 'Location endpoints',
    // 추후 위치 관련 로직 추가
  }))
  .get('/weather', () => ({
    message: 'Weather endpoints',
    // 추후 날씨 관련 로직 추가
  }));
