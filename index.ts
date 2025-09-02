import { Elysia } from 'elysia';
import { routes } from './src/routes';

new Elysia()
  .get('/', () => ({
    message: 'AirWhere API Server',
    version: '1.0.0',
    status: 'running',
    docs: {
      health: '/health',
      api: '/api/v1',
    },
  }))
  .use(routes)
  .listen(3000, () => {
    console.log(`🌬️  AirWhere server running on port 3000`);
  });
