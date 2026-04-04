import { FastifyInstance, FastifyRequest } from 'fastify';
import { chat, getInsights, getSmartInsight } from '../services/agent-service.js';

export async function agentRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request, reply) => {
    try { await request.jwtVerify(); } catch { return reply.code(401).send({ error: 'Unauthorized' }); }
  });

  const getUserId = (request: any) => request.user.userId;

  // POST /api/agent/chat — conversa com o Agent
  fastify.post('/chat', async (request: FastifyRequest, reply) => {
    try {
      const userId = getUserId(request);
      const { message, history } = request.body as { message: string; history?: any[] };

      if (!message || message.trim().length === 0) {
        return reply.code(400).send({ error: 'Mensagem obrigatória' });
      }

      const response = await chat(userId, message.trim(), history || []);
      return { response, timestamp: new Date().toISOString() };
    } catch (error: any) {
      fastify.log.error('Agent chat error: ' + (error instanceof Error ? error.message : String(error)));
      return reply.code(500).send({ error: 'Erro no agente. Tente novamente.' });
    }
  });

  // GET /api/agent/insights — insights automáticos baseados nos dados
  fastify.get('/insights', async (request, reply) => {
    try {
      const userId = getUserId(request);
      const insights = await getInsights(userId);
      return { insights, timestamp: new Date().toISOString() };
    } catch (error: any) {
      fastify.log.error('Agent insights error: ' + (error instanceof Error ? error.message : String(error)));
      return reply.code(500).send({ error: 'Erro ao gerar insights' });
    }
  });

  // GET /api/agent/smart-insight — 1 insight principal via Claude
  fastify.get('/smart-insight', async (request, reply) => {
    try {
      const userId = getUserId(request);
      const insight = await getSmartInsight(userId);
      return { insight, timestamp: new Date().toISOString() };
    } catch (error: any) {
      fastify.log.error('Agent smart-insight error: ' + (error instanceof Error ? error.message : String(error)));
      return reply.code(500).send({ error: 'Erro ao gerar insight' });
    }
  });
}
