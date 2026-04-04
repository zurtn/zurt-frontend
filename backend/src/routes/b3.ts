import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { callB3Api } from "../services/b3-client.js";

const VALID_TYPES = ["equities", "fixed-income", "treasury-bonds", "derivatives", "securities-lending"];

function validateType(type: string, reply: FastifyReply): boolean {
  if (!VALID_TYPES.includes(type)) {
    reply.code(400).send({ error: `Invalid type. Valid: ${VALID_TYPES.join(", ")}` });
    return false;
  }
  return true;
}

export async function b3Routes(fastify: FastifyInstance) {
  // GET /api/b3/guide?product=X&startDate=Y&endDate=Z
  fastify.get("/guide", { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { product, startDate, endDate } = request.query as {
      product?: string;
      startDate?: string;
      endDate?: string;
    };

    const params: Record<string, string> = {};
    if (product) params.product = product;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    try {
      const data = await callB3Api("GET", "/api/updated-product/v1/investors", params);
      return reply.send(data);
    } catch (err: any) {
      fastify.log.error("B3 guide error: " + String(err));
      return reply.code(502).send({ error: "B3 API error", details: err.message });
    }
  });

  // GET /api/b3/position/:type/:cpf?startDate=Y
  fastify.get("/position/:type/:cpf", { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { type, cpf } = request.params as { type: string; cpf: string };
    const { startDate, endDate, referenceDate } = request.query as { startDate?: string; endDate?: string; referenceDate?: string };

    if (!validateType(type, reply)) return;

    const params: Record<string, string> = {};
    if (startDate || referenceDate) params.referenceStartDate = (startDate || referenceDate)!;
    if (endDate || referenceDate) params.referenceEndDate = (endDate || referenceDate)!;

    try {
      const data = await callB3Api("GET", `/api/position/v3/${type}/investors/${cpf}`, params);
      return reply.send(data);
    } catch (err: any) {
      fastify.log.error("B3 position error: " + String(err));
      return reply.code(502).send({ error: "B3 API error", details: err.message });
    }
  });

  // GET /api/b3/movement/:type/:cpf?startDate=Y&endDate=Z
  fastify.get("/movement/:type/:cpf", { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { type, cpf } = request.params as { type: string; cpf: string };
    const { startDate, endDate } = request.query as { startDate?: string; endDate?: string };

    if (!validateType(type, reply)) return;

    const params: Record<string, string> = {};
    if (startDate) params.referenceStartDate = startDate;
    if (endDate) params.referenceEndDate = endDate;

    try {
      const data = await callB3Api("GET", `/api/movement/v2/${type}/investors/${cpf}`, params);
      return reply.send(data);
    } catch (err: any) {
      fastify.log.error("B3 movement error: " + String(err));
      return reply.code(502).send({ error: "B3 API error", details: err.message });
    }
  });

  // GET /api/b3/events/:cpf
  fastify.get("/events/:cpf", { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { cpf } = request.params as { cpf: string };
    const { referenceDate } = request.query as { referenceDate?: string };

    const params: Record<string, string> = {};
    if (referenceDate) params.referenceDate = referenceDate;

    try {
      const data = await callB3Api("GET", `/api/provisioned-events/v2/investors/${cpf}`, params);
      return reply.send(data);
    } catch (err: any) {
      fastify.log.error("B3 events error: " + String(err));
      return reply.code(502).send({ error: "B3 API error", details: err.message });
    }
  });
}
