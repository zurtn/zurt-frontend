import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/connection.js";
import { sendPushToAll, sendPushToTokens } from "../services/push-service.js";

export async function postRoutes(fastify: FastifyInstance) {
  // ── Admin middleware ──────────────────────────────────────────────────
  const requireAdmin = async (request: any, reply: any) => {
    await fastify.authenticate(request, reply);
    if ((request as any).user?.role !== 'admin') {
      return reply.code(403).send({ error: 'Admin access required' });
    }
  };

  // ── Public routes (any authenticated user) ─────────────────────────────

  // GET /api/posts — Feed
  fastify.get("/posts", { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { page = "1", limit = "10", category } = request.query as any;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = "WHERE p.status = 'published'";
    const params: any[] = [parseInt(limit), offset];
    if (category) {
      where += ` AND p.category = $${params.length + 1}`;
      params.push(category);
    }

    const countWhere = params.length > 2 ? "WHERE p.status = 'published' AND p.category = $1" : "WHERE p.status = 'published'"; const countResult = await db.query(`SELECT count(*) FROM posts p ${countWhere}`, params.slice(2));
    const total = parseInt(countResult.rows[0].count);

    const result = await db.query(`
      SELECT p.id, p.title, p.subtitle, p.category, p.cover_image_url, p.pdf_url, p.external_url,
             p.published_at, p.views_count, p.likes_count, p.tags,
             u.full_name as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      ${where}
      ORDER BY p.published_at DESC NULLS LAST
      LIMIT $1 OFFSET $2
    `, params);

    return reply.send({ posts: result.rows, total, page: parseInt(page) });
  });

  // GET /api/posts/:id — Single post
  fastify.get("/posts/:id", { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as any).userId;
    const { id } = request.params as { id: string };

    const result = await db.query(`
      SELECT p.*, u.full_name as author_name,
        (SELECT EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $2)) as liked
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = $1
    `, [id, userId]);

    if (result.rows.length === 0) {
      return reply.code(404).send({ error: "Post not found" });
    }

    // Track view (deduplicated per user)
    const viewResult = await db.query(
      "INSERT INTO post_views (post_id, user_id) VALUES ($1, $2) ON CONFLICT (post_id, user_id) DO NOTHING RETURNING id",
      [id, userId]
    );
    if (viewResult.rowCount && viewResult.rowCount > 0) {
      await db.query("UPDATE posts SET views_count = views_count + 1 WHERE id = $1", [id]);
    }

    return reply.send({ post: result.rows[0] });
  });

  // POST /api/posts/:id/like — Toggle like
  fastify.post("/posts/:id/like", { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as any).userId;
    const { id } = request.params as { id: string };

    // Transaction to prevent race conditions
    const client = await (db as any).connect ? (db as any).connect() : db;
    try {
      await client.query('BEGIN');
      const existing = await client.query(
        "SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2 FOR UPDATE", [id, userId]
      );

      let liked: boolean;
      if (existing.rows.length > 0) {
        await client.query("DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2", [id, userId]);
        await client.query("UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1", [id]);
        liked = false;
      } else {
        await client.query("INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)", [id, userId]);
        await client.query("UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1", [id]);
        liked = true;
      }

      const countResult = await client.query("SELECT likes_count FROM posts WHERE id = $1", [id]);
      await client.query('COMMIT');
      return reply.send({ liked, likesCount: countResult.rows[0]?.likes_count || 0 });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      if (client.release) client.release();
    }
  });

  // ── Admin routes ───────────────────────────────────────────────────────

  // POST /api/admin/posts — Create
  fastify.post("/admin/posts", { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as any).userId;
    const { title, subtitle, body, category, tags, pdfUrl, externalUrl, coverImageUrl, status } = request.body as any;

    if (!title?.trim()) return reply.code(400).send({ error: "Title required" });

    const publishedAt = status === "published" ? "NOW()" : "NULL";
    const result = await db.query(`
      INSERT INTO posts (author_id, title, subtitle, body, category, tags, pdf_url, external_url, cover_image_url, status, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ${publishedAt})
      RETURNING *
    `, [userId, title.trim(), subtitle || null, body || null, category || "analysis",
        tags || [], pdfUrl || null, externalUrl || null, coverImageUrl || null, status || "draft"]);

    return reply.code(201).send({ post: result.rows[0] });
  });

  // GET /api/admin/posts — List all (including drafts)
  fastify.get("/admin/posts", { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { status: filterStatus } = request.query as any;
    let where = "";
    const params: any[] = [];
    if (filterStatus) {
      where = "WHERE p.status = $1";
      params.push(filterStatus);
    }

    const result = await db.query(`
      SELECT p.*, u.full_name as author_name
      FROM posts p LEFT JOIN users u ON p.author_id = u.id
      ${where}
      ORDER BY p.updated_at DESC
    `, params);

    return reply.send({ posts: result.rows });
  });

  // PATCH /api/admin/posts/:id — Update
  fastify.patch("/admin/posts/:id", { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as any;

    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, val] of Object.entries(updates)) {
      const colMap: Record<string, string> = {
        title: "title", subtitle: "subtitle", body: "body", category: "category",
        tags: "tags", pdfUrl: "pdf_url", externalUrl: "external_url",
        coverImageUrl: "cover_image_url", status: "status",
      };
      if (colMap[key]) {
        fields.push(`${colMap[key]} = $${idx}`);
        values.push(val);
        idx++;
      }
    }

    if (updates.status === "published") {
      fields.push(`published_at = COALESCE(published_at, NOW())`);
    }
    fields.push("updated_at = NOW()");

    if (fields.length <= 1) return reply.code(400).send({ error: "No fields to update" });

    values.push(id);
    await db.query(`UPDATE posts SET ${fields.join(", ")} WHERE id = $${idx}`, values);

    const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
    return reply.send({ post: result.rows[0] });
  });

  // DELETE /api/admin/posts/:id
  fastify.delete("/admin/posts/:id", { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    await db.query("DELETE FROM posts WHERE id = $1", [id]);
    return reply.send({ success: true });
  });

  // POST /api/admin/posts/:id/publish-and-push — Publish + send push
  fastify.post("/admin/posts/:id/publish-and-push", { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const { target, targetValue } = request.body as any;

    // Publish
    await db.query(
      "UPDATE posts SET status = 'published', published_at = COALESCE(published_at, NOW()), push_sent = true, push_target = $2, updated_at = NOW() WHERE id = $1",
      [id, target || "all"]
    );

    const postResult = await db.query("SELECT title, subtitle, body FROM posts WHERE id = $1", [id]);
    if (postResult.rows.length === 0) return reply.code(404).send({ error: "Post not found" });

    const post = postResult.rows[0];
    const pushBody = post.subtitle || (post.body ? post.body.substring(0, 120) + "..." : "Novo conteudo no ZURT");
    const pushData = { screen: `/post/${id}`, postId: id, type: "post" };

    let sent = 0;
    if (!target || target === "all") {
      sent = await sendPushToAll(post.title, pushBody, pushData);
    } else if (target === "plan" && targetValue) {
      const planUsers = await db.query(`
        SELECT u.push_token FROM users u
        JOIN subscriptions s ON s.user_id = u.id
        WHERE s.plan_code = $1 AND s.status = 'active' AND u.push_token IS NOT NULL
      `, [targetValue]);
      const tokens = planUsers.rows.map((r: any) => r.push_token).filter(Boolean);
      sent = await sendPushToTokens(tokens, post.title, pushBody, pushData);
    }

    return reply.send({ success: true, sent });
  });
}
