import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import multipart from "@fastify/multipart";
import cookie from '@fastify/cookie';
import dotenv from 'dotenv';
import { db } from './db/connection.js';
import { aiRoutes } from './routes/ai.js';
import { marketRoutes } from './routes/market.js';
import { familyRoutes } from './routes/family.js';
import { dollarRoutes } from './routes/dollar.js';
import { agentRoutes } from './routes/agent.js';
import { pushRoutes } from './routes/push.js';
import { invitePageRoutes } from './routes/invite-page.js';
import { reportRoutes } from './routes/report.js';
import { authRoutes } from './routes/auth.js';
import { usersRoutes } from './routes/users.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { connectionsRoutes } from './routes/connections.js';
import { accountsRoutes } from './routes/accounts.js';
import { financeRoutes } from './routes/finance.js';
import { cardsRoutes } from './routes/cards.js';
import { investmentsRoutes } from './routes/investments.js';
import { adminRoutes } from './routes/admin.js';
import { consultantRoutes } from './routes/consultant.js';
import { customerRoutes } from './routes/customer.js';
import { reportsRoutes } from './routes/reports.js';
import { goalsRoutes } from './routes/goals.js';
import { notificationsRoutes } from './routes/notifications.js';
import { plansRoutes } from './routes/plans.js';
import { publicRoutes } from './routes/public.js';
import { subscriptionsRoutes } from './routes/subscriptions.js';
import { commentsRoutes } from './routes/comments.js';
import { mercadopagoRoutes } from './routes/mercadopago.js';
import { stripeRoutes } from './routes/stripe.js';
import { messageFileRoutes } from './routes/message-files.js';
import { marketDataRoutes } from './routes/market-data.js';
import { portfolioRoutes } from './routes/portfolio.js';
import { setupWebSocket } from './websocket/websocket.js';
import { startSyncScheduler } from './services/sync-scheduler.js';
import { faceVerificationRoutes } from "./routes/face-verification.js";
import { b3Routes } from "./routes/b3.js";
import { postRoutes } from "./routes/posts.js";
import { onboardingRoutes } from "./routes/onboarding.js";
import { startGoalDeadlineChecker } from './services/goal-deadline-checker.js';
import { startMarketCrons } from './services/market-cron.js';
import { startSmartPushCrons } from "./services/smart-push-crons.js";

dotenv.config();

const fastify = Fastify({
  trustProxy: true,
  bodyLimit: 20 * 1024 * 1024,
  logger: true,
});

// Register plugins
// Rate limiting
await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: 'Limite de requisições excedido. Tente novamente em 1 minuto.'
  })
});
// Raw body for Stripe webhook signature verification
fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, (req, body, done) => {
  try {
    (req as any).rawBody = body.toString('utf8');
    const json = JSON.parse(body.toString('utf8'));
    done(null, json);
  } catch (err: any) {
    done(err, undefined);
  }
});

await fastify.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });
await fastify.register(cors, {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Get allowed origins from environment or use defaults
    const allowedOrigins = process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
      : [
          'http://localhost:8080',
          'http://localhost:8081',
          'http://127.0.0.1:8080',
          'http://127.0.0.1:8081',
          'http://167.71.94.65',
          'http://167.71.94.65:80',
          'http://167.71.94.65:8080',
          'http://167.71.94.65:8081',
        ];

    // Normalize origin (remove trailing slash if present)
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

    // Check if origin is allowed (exact match)
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    // Also check if origin starts with allowed IP (for any port)
    try {
      const originUrl = new URL(normalizedOrigin);
      const originHostname = originUrl.hostname;

      // Check if the hostname matches any of our allowed IPs or domains
      const allowedHostnames = [
        'localhost',
        '127.0.0.1',
        '167.71.94.65',
        'www.zurt.com.br',
        'zurt.com.br',
      ];

      if (allowedHostnames.includes(originHostname)) {
        callback(null, true);
        return;
      }
    } catch (e) {
      // URL parsing failed, deny
    }

    // Deny by default
    fastify.log.warn({ origin: normalizedOrigin, allowedOrigins }, 'CORS request blocked');
    callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
});

await fastify.register(cookie, {
  parseOptions: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  },
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  cookie: {
    cookieName: 'token',
    signed: false,
  },
});

// Add authenticate decorator
fastify.decorate('authenticate', async function (request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Health check
fastify.get('/api/health', async () => {
  try {
    await db.query('SELECT 1');
    return { status: 'ok', database: 'connected' };
  } catch (error) {
    return { status: 'error', database: 'disconnected' };
  }
});

// Register routes
await fastify.register(aiRoutes, { prefix: '/api/ai' });
await fastify.register(marketRoutes, { prefix: '/api/market' });
await fastify.register(familyRoutes, { prefix: '/api/family' });
  await fastify.register(dollarRoutes, { prefix: '/api/dollar' });
  await fastify.register(agentRoutes, { prefix: '/api/agent' });
await fastify.register(pushRoutes, { prefix: '/api' });
await fastify.register(invitePageRoutes, { prefix: '/invite' });
await fastify.register(reportRoutes, { prefix: '/api/ai' });
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(usersRoutes, { prefix: '/api/users' });
await fastify.register(dashboardRoutes, { prefix: '/api/dashboard' });
await fastify.register(connectionsRoutes, { prefix: '/api/connections' });
await fastify.register(accountsRoutes, { prefix: '/api/accounts' });
await fastify.register(financeRoutes, { prefix: '/api/finance' });
await fastify.register(cardsRoutes, { prefix: '/api/cards' });
await fastify.register(investmentsRoutes, { prefix: '/api/investments' });
await fastify.register(adminRoutes, { prefix: '/api/admin' });
await fastify.register(consultantRoutes, { prefix: '/api/consultant' });
await fastify.register(customerRoutes, { prefix: '/api/customer' });
await fastify.register(reportsRoutes, { prefix: '/api/reports' });
await fastify.register(goalsRoutes, { prefix: '/api/goals' });
await fastify.register(notificationsRoutes, { prefix: '/api/notifications' });
await fastify.register(plansRoutes, { prefix: '/api/plans' });
await fastify.register(publicRoutes, { prefix: '/api/public' });
await fastify.register(subscriptionsRoutes, { prefix: '/api/subscriptions' });
await fastify.register(commentsRoutes, { prefix: '/api/comments' });
await fastify.register(mercadopagoRoutes, { prefix: '/api/mercadopago' });
await fastify.register(stripeRoutes, { prefix: '/api/stripe' });
await fastify.register(messageFileRoutes, { prefix: '/api/messages' });
  await fastify.register(faceVerificationRoutes, { prefix: "/api/auth" });
  await fastify.register(b3Routes, { prefix: "/api/b3" });
  await fastify.register(postRoutes, { prefix: "/api" });
  await fastify.register(onboardingRoutes, { prefix: "/api/onboarding" });
await fastify.register(marketDataRoutes, { prefix: '/api/market-data' });
await fastify.register(portfolioRoutes, { prefix: '/api/portfolio' });

// Ensure system_settings table and defaults exist (idempotent, runs on every startup)
async function ensureSystemSettings() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS system_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`);
    await db.query(
      `INSERT INTO system_settings (key, value) VALUES ('registration_requires_approval', 'true') ON CONFLICT (key) DO NOTHING`
    );
  } catch (err) {
    console.error('Warning: could not initialize system_settings table:', err);
  }
}

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 5000;
    const host = process.env.HOST || '0.0.0.0';

    // Ensure required DB tables/settings exist before accepting traffic
    await ensureSystemSettings();

    // Start listening FIRST
    await fastify.listen({ port, host });

    // Setup WebSocket AFTER listening (uses the existing server instance)
    setupWebSocket(fastify);

    console.log(`🚀 Server running on http://${host}:${port}`);
    console.log(`📡 WebSocket available on ws://${host}:${port}/ws`);

    // Start background sync scheduler (every 6 hours)
    startSyncScheduler();
    console.log(`🔄 Pluggy sync scheduler started (every 6 hours)`);

    // Start goal deadline checker (every 24 hours)
    startGoalDeadlineChecker();
    startMarketCrons();
    startSmartPushCrons();
    console.log(`🎯 Goal deadline checker started (every 24 hours)`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
