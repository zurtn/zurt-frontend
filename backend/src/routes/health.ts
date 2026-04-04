import { FastifyInstance } from 'fastify';
import { db } from '../db/connection.js';

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (req, reply) => {
    let dbStatus = 'error';
    try { await db.query('SELECT 1'); dbStatus = 'connected'; } catch {}
    return reply.send({
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      version: '1.0.0',
    });
  });
}
