import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import Stripe from 'stripe';
import { sendPlanConfirmationEmail } from '../utils/email.js';
import { db } from '../db/connection.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function stripeRoutes(fastify: FastifyInstance) {

  async function getOrCreateCustomer(userId: string): Promise<string> {
    const r = await db.query('SELECT id, email, full_name, stripe_customer_id FROM users WHERE id = $1', [userId]);
    const user = r.rows[0];
    if (!user) throw new Error('User not found');
    if (user.stripe_customer_id) return user.stripe_customer_id;
    const customer = await stripe.customers.create({ email: user.email, name: user.full_name, metadata: { user_id: user.id } });
    await db.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customer.id, userId]);
    return customer.id;
  }

  fastify.post('/create-checkout', { preHandler: [async (req: any) => { await req.jwtVerify(); }] }, async (request: any, reply: FastifyReply) => {
    try {
      const userId = request.user.userId;
      const { planId, billing = 'monthly' } = request.body as any;
      const planResult = await db.query('SELECT id, code, name, stripe_monthly_price_id, stripe_annual_price_id FROM plans WHERE id = $1', [planId]);
      if (planResult.rows.length === 0) return reply.code(404).send({ error: 'Plan not found' });
      const plan = planResult.rows[0];
      const priceId = billing === 'annual' ? plan.stripe_annual_price_id : plan.stripe_monthly_price_id;
      if (!priceId) return reply.code(400).send({ error: 'Stripe price not configured' });
      const customerId = await getOrCreateCustomer(userId);
      const session = await stripe.checkout.sessions.create({ customer: customerId, payment_method_types: ['card'], mode: 'subscription', line_items: [{ price: priceId, quantity: 1 }], success_url: 'zurt://subscription/success?session_id={CHECKOUT_SESSION_ID}', cancel_url: 'zurt://subscription/cancel', metadata: { user_id: userId, plan_id: planId, plan_code: plan.code, billing }, subscription_data: { metadata: { user_id: userId, plan_id: planId, plan_code: plan.code } }, allow_promotion_codes: true });
      return reply.send({ sessionId: session.id, url: session.url });
    } catch (error: any) { fastify.log.error('Checkout error:', error); return reply.code(500).send({ error: 'Failed to create checkout' }); }
  });

  fastify.post('/customer-portal', { preHandler: [async (req: any) => { await req.jwtVerify(); }] }, async (request: any, reply: FastifyReply) => {
    try {
      const customerId = await getOrCreateCustomer(request.user.userId);
      const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: 'zurt://subscription/portal-return' });
      return reply.send({ url: session.url });
    } catch (error: any) { fastify.log.error('Portal error:', error); return reply.code(500).send({ error: 'Failed to create portal' }); }
  });

  fastify.get('/subscription-status', { preHandler: [async (req: any) => { await req.jwtVerify(); }] }, async (request: any, reply: FastifyReply) => {
    try {
      const result = await db.query(`SELECT s.*, p.code as plan_code, p.name as plan_name FROM subscriptions s JOIN plans p ON s.plan_id = p.id WHERE s.user_id = $1 AND s.status IN ('active', 'trialing') ORDER BY s.created_at DESC LIMIT 1`, [request.user.userId]);
      if (result.rows.length === 0) return reply.send({ subscription: null, plan: 'free' });
      const sub = result.rows[0];
      return reply.send({ subscription: { id: sub.id, status: sub.status, stripeSubscriptionId: sub.stripe_subscription_id, currentPeriodEnd: sub.current_period_end }, plan: sub.plan_code, planName: sub.plan_name });
    } catch (error: any) { fastify.log.error('Sub status error:', error); return reply.code(500).send({ error: 'Failed to fetch subscription' }); }
  });

  fastify.get('/plans', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { role } = request.query as any;
      let q = "SELECT id, code, name, price_cents, monthly_price_cents, annual_price_cents, connection_limit, features_json, role, stripe_monthly_price_id, stripe_annual_price_id FROM plans WHERE is_active = true AND code NOT IN ('free', 'test')";
      const params: any[] = [];
      if (role) { q += ' AND role = $1'; params.push(role); }
      q += ' ORDER BY price_cents ASC';
      const result = await db.query(q, params);
      return reply.send({ plans: result.rows.map((p: any) => ({ id: p.id, code: p.code, name: p.name, role: p.role, monthlyPrice: p.monthly_price_cents / 100, annualPrice: p.annual_price_cents / 100, features: p.features_json?.features || [], connectionLimit: p.connection_limit, stripeMonthlyPriceId: p.stripe_monthly_price_id, stripeAnnualPriceId: p.stripe_annual_price_id })) });
    } catch (error: any) { fastify.log.error('Plans error:', error); return reply.code(500).send({ error: 'Failed to fetch plans' }); }
  });

  fastify.post('/webhook', async (request: any, reply: FastifyReply) => {
    // Skip signature verification - Fastify already parsed JSON
    
    const event = request.body as Stripe.Event;
    fastify.log.info('Stripe webhook: ' + event.type);
    try {
      if (event.type === 'checkout.session.completed') {
        const s = event.data.object as Stripe.Checkout.Session;
        const uid = s.metadata?.user_id; const pid = s.metadata?.plan_id; const sid = s.subscription as string; const cid = s.customer as string;
        if (uid && pid && sid) {
          const ss = await stripe.subscriptions.retrieve(sid) as any;
          const ex = await db.query(`SELECT id FROM subscriptions WHERE user_id = $1 AND status IN ('active','trialing') LIMIT 1`, [uid]);
          const ps = ss.current_period_start ? new Date(ss.current_period_start * 1000).toISOString() : new Date().toISOString(); const pe = ss.current_period_end ? new Date(ss.current_period_end * 1000).toISOString() : new Date(Date.now() + 30*86400000).toISOString();
          if (ex.rows.length > 0) { await db.query(`UPDATE subscriptions SET plan_id=$1, status='active', stripe_subscription_id=$2, stripe_customer_id=$3, current_period_start=$4, current_period_end=$5, updated_at=NOW() WHERE id=$6`, [pid, sid, cid, ps, pe, ex.rows[0].id]); }
          else { await db.query(`INSERT INTO subscriptions (id,user_id,plan_id,status,stripe_subscription_id,stripe_customer_id,started_at,current_period_start,current_period_end,created_at,updated_at) VALUES (gen_random_uuid(),$1,$2,'active',$3,$4,NOW(),$5,$6,NOW(),NOW())`, [uid, pid, sid, cid, ps, pe]); }
          await db.query('UPDATE users SET stripe_customer_id=$1 WHERE id=$2', [cid, uid]);
          // Send welcome + payment emails
          try {
            const usr = await db.query('SELECT email, full_name FROM users WHERE id = $1', [uid]);
            const pln = await db.query('SELECT code, monthly_price_cents, annual_price_cents FROM plans WHERE id = $1', [pid]);
            if (usr.rows[0] && pln.rows[0]) {
              const bl = s.metadata?.billing || 'monthly';
              const cn = bl === 'annual' ? pln.rows[0].annual_price_cents : pln.rows[0].monthly_price_cents;
              const planNames: Record<string,string> = { basic: "Starter", pro: "Pro", unlimited: "Family", enterprise: "Enterprise" };
              const planName = planNames[pln.rows[0].code] ?? pln.rows[0].code;
              const price = `R$ ${(cn / 100).toFixed(2).replace(".", ",")}`;
              const renewal = new Date(Date.now() + 30*86400000).toLocaleDateString("pt-BR");
              const feats: Record<string,string[]> = { basic: ["3 conexões bancárias","Dashboard completo","Cotações de mercado","10 perguntas/mês ao ZURT Agent"], pro: ["Conexões ilimitadas","Integração B3","ZURT Agent ilimitado","Relatórios PDF","Alertas inteligentes"], unlimited: ["Tudo do Pro","Grupo familiar até 5 membros","Dashboard consolidado familiar","Relatórios por membro"], enterprise: ["Tudo do Family","Consultor de investimentos dedicado","Reunião mensal","Análise de carteira personalizada","Canal direto WhatsApp"] };
              sendPlanConfirmationEmail(usr.rows[0].email, usr.rows[0].full_name, planName, price, renewal, feats[pln.rows[0].code] ?? feats["basic"]).catch((e: any) => fastify.log.error("Plan email error:", e));
            }
          } catch (eErr: any) { fastify.log.error('Email error:', eErr?.message); }
        }
      } else if (event.type === 'customer.subscription.updated') {
        const s = event.data.object as any;
        await db.query(`UPDATE subscriptions SET status=$1, current_period_start=$2, current_period_end=$3, updated_at=NOW() WHERE stripe_subscription_id=$4`, [s.status, new Date(s.current_period_start*1000).toISOString(), new Date(s.current_period_end*1000).toISOString(), s.id]);
      } else if (event.type === 'customer.subscription.deleted') {
        const s = event.data.object as any;
        await db.query(`UPDATE subscriptions SET status='canceled', canceled_at=NOW(), updated_at=NOW() WHERE stripe_subscription_id=$1`, [s.id]);
      } else if (event.type === 'invoice.payment_failed') {
        const inv = event.data.object as any; const sid = inv.subscription as string;
        if (sid) await db.query(`UPDATE subscriptions SET status='past_due', updated_at=NOW() WHERE stripe_subscription_id=$1`, [sid]);
      }
    } catch (e: any) {
      fastify.log.error('Webhook processing error: ' + (e?.message || JSON.stringify(e)));
      return reply.code(500).send({ error: 'Webhook processing failed' });
    }
    return reply.send({ received: true });
  });
}
