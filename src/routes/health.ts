import { Elysia } from 'elysia';

export const healthRoutes = new Elysia({ prefix: '/health' })
  .get('/', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  }))
  .get('/ping', () => ({ message: 'pong' }));
