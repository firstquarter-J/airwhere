import { Elysia } from 'elysia';
import { location } from './routes/location';

export const app = new Elysia()
  .get('/', () => 'AirWhere API Server')
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }))
  .use(location);

