import { Elysia } from 'elysia';

new Elysia()
  .get('/', () => 'AirWhere API Server')
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }))
  .listen(3000, () => {
    console.log(`🌬️ AirWhere server running on port 3000`);
  });