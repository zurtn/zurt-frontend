import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/connection.js";

interface VerifyFaceBody {
  challenges_passed: string[];
  device_platform: string;
}

export async function faceVerificationRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/verify-face",
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).userId;
      const { challenges_passed, device_platform } = request.body as VerifyFaceBody;

      const requiredChallenges = ["center", "blink", "turn_right", "smile"];
      const allPassed = requiredChallenges.every((c) =>
        challenges_passed?.includes(c)
      );

      if (!allPassed) {
        return reply.status(400).send({
          error: "Nem todos os desafios foram concluídos.",
          required: requiredChallenges,
          received: challenges_passed,
        });
      }

      try {
        await db.query(
          `UPDATE users
           SET face_verified_at = NOW(),
               face_device_platform = $2,
               updated_at = NOW()
           WHERE id = $1`,
          [userId, device_platform || "unknown"]
        );

        await db.query(
          `INSERT INTO login_history (user_id, event_type, metadata)
           VALUES ($1, $2, $3)`,
          [
            userId,
            "face_verified",
            JSON.stringify({
              challenges: challenges_passed,
              platform: device_platform,
              verified_at: new Date().toISOString(),
            }),
          ]
        );

        return reply.send({
          success: true,
          message: "Verificação facial concluída com sucesso.",
          face_verified_at: new Date().toISOString(),
        });
      } catch (err: any) {
        request.log.error(err, "Face verification failed");
        return reply.status(500).send({
          error: "Erro interno ao salvar verificação facial.",
        });
      }
    }
  );

  fastify.get(
    "/face-status",
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).userId;

      try {
        const { rows } = await db.query(
          `SELECT face_verified_at, face_device_platform
           FROM users WHERE id = $1`,
          [userId]
        );

        if (rows.length === 0) {
          return reply.status(404).send({ error: "Usuário não encontrado." });
        }

        return reply.send({
          verified: !!rows[0].face_verified_at,
          face_verified_at: rows[0].face_verified_at,
          device_platform: rows[0].face_device_platform,
        });
      } catch (err: any) {
        request.log.error(err, "Face status check failed");
        return reply.status(500).send({ error: "Erro interno." });
      }
    }
  );
}
