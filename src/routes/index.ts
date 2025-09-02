import { Elysia } from 'elysia';
import { healthRoutes } from './health';
import { apiRoutes } from './api';

export const routes = new Elysia().use(healthRoutes).use(apiRoutes);
