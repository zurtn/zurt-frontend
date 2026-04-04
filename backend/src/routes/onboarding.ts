import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/connection.js";

function getUserId(req: any): string {
  return req.user?.userId || req.user?.id;
}

export async function onboardingRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", async (req: FastifyRequest, reply: FastifyReply) => {
    await fastify.authenticate(req, reply);
  });

  // GET /api/onboarding
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    const { rows: [profile] } = await db.query("SELECT * FROM investor_profiles WHERE user_id = $1", [userId]);
    if (!profile)
      return reply.send({ profile: null, dependents: [], properties: [], insurances: [], debts: [], vehicles: [], product_experience: [], onboarding_completed: false, onboarding_step: 0 });
    const [dep, prop, ins, debt, veh, pexp] = await Promise.all([
      db.query("SELECT * FROM investor_dependents WHERE user_id = $1 ORDER BY created_at", [userId]),
      db.query("SELECT * FROM investor_properties WHERE user_id = $1 ORDER BY created_at", [userId]),
      db.query("SELECT * FROM investor_insurances WHERE user_id = $1 ORDER BY created_at", [userId]),
      db.query("SELECT * FROM investor_debts WHERE user_id = $1 ORDER BY created_at", [userId]),
      db.query("SELECT * FROM investor_vehicles WHERE user_id = $1 ORDER BY created_at", [userId]),
      db.query("SELECT * FROM investor_product_experience WHERE user_id = $1 ORDER BY product_type", [userId]),
    ]);
    return reply.send({ profile, dependents: dep.rows, properties: prop.rows, insurances: ins.rows, debts: debt.rows, vehicles: veh.rows, product_experience: pexp.rows, onboarding_completed: profile.onboarding_completed, onboarding_step: profile.onboarding_step });
  });

  // PUT /api/onboarding/profile
  fastify.put("/profile", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    const b = (req.body || {}) as any;
    const fields = ["cpf", "date_of_birth", "gender", "nationality", "birth_city", "birth_state", "phone", "address_zip", "address_street", "address_number", "address_complement", "address_neighborhood", "address_city", "address_state", "occupation", "employer", "employer_cnpj", "job_title", "monthly_income_cents", "income_source", "marital_status", "marriage_regime", "spouse_name", "spouse_cpf", "spouse_occupation", "spouse_income_cents", "total_patrimony_cents", "patrimony_range", "liquid_patrimony_cents", "investor_profile", "risk_tolerance", "investment_horizon", "loss_tolerance_pct", "monthly_investment_cents", "experience_years", "experience_level", "primary_goal", "secondary_goal", "financial_independence_age", "has_will", "has_holding", "has_life_insurance", "succession_notes", "has_private_pension", "pension_type", "pension_monthly_cents", "pension_total_cents", "is_pep", "is_us_person", "pep_description", "onboarding_step", "onboarding_completed"];
    const present = fields.filter(f => b[f] !== undefined);
    if (present.length === 0)
      return reply.code(400).send({ error: "Nenhum campo enviado" });
    const vals = present.map(f => b[f]);
    const setClauses = present.map((f, i) => `${f} = $${i + 2}`).join(", ");
    const insertCols = ["user_id", ...present].join(", ");
    const insertPlaceholders = [userId, ...vals].map((_, i) => `$${i + 1}`).join(", ");
    const { rows: [profile] } = await db.query(
      `INSERT INTO investor_profiles (${insertCols}) VALUES (${insertPlaceholders}) ON CONFLICT (user_id) DO UPDATE SET ${setClauses} RETURNING *`,
      [userId, ...vals]
    );
    return reply.send({ profile });
  });

  // POST /api/onboarding/dependents
  fastify.post("/dependents", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    const b = req.body as any;
    const { rows: [dep] } = await db.query(
      "INSERT INTO investor_dependents (user_id, full_name, relationship, date_of_birth, cpf, is_minor, has_special_needs, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [userId, b.full_name, b.relationship, b.date_of_birth || null, b.cpf || null, b.is_minor ?? false, b.has_special_needs ?? false, b.notes || null]
    );
    return reply.code(201).send({ dependent: dep });
  });

  fastify.delete("/dependents/:id", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    await db.query("DELETE FROM investor_dependents WHERE id = $1 AND user_id = $2", [(req.params as any).id, userId]);
    return reply.send({ deleted: true });
  });

  // POST /api/onboarding/properties
  fastify.post("/properties", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    const b = req.body as any;
    const { rows: [p] } = await db.query(
      "INSERT INTO investor_properties (user_id, property_type, ownership, usage, address_city, address_state, estimated_value_cents, outstanding_balance_cents, monthly_payment_cents, financing_end_date, financing_bank, financing_rate_pct, rental_income_cents, has_registration, registration_number, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *",
      [userId, b.property_type, b.ownership, b.usage || null, b.address_city || null, b.address_state || null, b.estimated_value_cents || null, b.outstanding_balance_cents || null, b.monthly_payment_cents || null, b.financing_end_date || null, b.financing_bank || null, b.financing_rate_pct || null, b.rental_income_cents || null, b.has_registration ?? true, b.registration_number || null, b.notes || null]
    );
    return reply.code(201).send({ property: p });
  });

  fastify.delete("/properties/:id", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    await db.query("DELETE FROM investor_properties WHERE id = $1 AND user_id = $2", [(req.params as any).id, userId]);
    return reply.send({ deleted: true });
  });

  // POST /api/onboarding/insurances
  fastify.post("/insurances", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    const b = req.body as any;
    const { rows: [ins] } = await db.query(
      "INSERT INTO investor_insurances (user_id, insurance_type, provider, policy_number, coverage_cents, monthly_premium_cents, annual_premium_cents, beneficiaries, expiry_date, is_active, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
      [userId, b.insurance_type, b.provider || null, b.policy_number || null, b.coverage_cents || null, b.monthly_premium_cents || null, b.annual_premium_cents || null, b.beneficiaries || null, b.expiry_date || null, b.is_active ?? true, b.notes || null]
    );
    return reply.code(201).send({ insurance: ins });
  });

  fastify.delete("/insurances/:id", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    await db.query("DELETE FROM investor_insurances WHERE id = $1 AND user_id = $2", [(req.params as any).id, userId]);
    return reply.send({ deleted: true });
  });

  // POST /api/onboarding/debts
  fastify.post("/debts", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    const b = req.body as any;
    const { rows: [d] } = await db.query(
      "INSERT INTO investor_debts (user_id, debt_type, creditor, original_amount_cents, outstanding_balance_cents, monthly_payment_cents, interest_rate_pct, installments_total, installments_remaining, start_date, end_date, is_active, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *",
      [userId, b.debt_type, b.creditor || null, b.original_amount_cents || null, b.outstanding_balance_cents || null, b.monthly_payment_cents || null, b.interest_rate_pct || null, b.installments_total || null, b.installments_remaining || null, b.start_date || null, b.end_date || null, b.is_active ?? true, b.notes || null]
    );
    return reply.code(201).send({ debt: d });
  });

  fastify.delete("/debts/:id", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    await db.query("DELETE FROM investor_debts WHERE id = $1 AND user_id = $2", [(req.params as any).id, userId]);
    return reply.send({ deleted: true });
  });

  // POST /api/onboarding/vehicles
  fastify.post("/vehicles", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    const b = req.body as any;
    const { rows: [v] } = await db.query(
      "INSERT INTO investor_vehicles (user_id, vehicle_type, brand, model, year, is_financed, estimated_value_cents, outstanding_balance_cents, is_insured, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
      [userId, b.vehicle_type, b.brand || null, b.model || null, b.year || null, b.is_financed ?? false, b.estimated_value_cents || null, b.outstanding_balance_cents || null, b.is_insured ?? false, b.notes || null]
    );
    return reply.code(201).send({ vehicle: v });
  });

  fastify.delete("/vehicles/:id", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    await db.query("DELETE FROM investor_vehicles WHERE id = $1 AND user_id = $2", [(req.params as any).id, userId]);
    return reply.send({ deleted: true });
  });

  // PUT /api/onboarding/product-experience
  fastify.put("/product-experience", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    const { products } = req.body as any;
    if (!products || !Array.isArray(products))
      return reply.code(400).send({ error: "products array required" });
    for (const p of products) {
      await db.query(
        "INSERT INTO investor_product_experience (user_id, product_type, has_experience, comfort_level, current_allocation_pct) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (user_id, product_type) DO UPDATE SET has_experience=$3, comfort_level=$4, current_allocation_pct=$5",
        [userId, p.product_type, p.has_experience, p.comfort_level || null, p.current_allocation_pct || null]
      );
    }
    const { rows } = await db.query("SELECT * FROM investor_product_experience WHERE user_id = $1 ORDER BY product_type", [userId]);
    return reply.send({ products: rows });
  });

  // POST /api/onboarding/complete
  fastify.post("/complete", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    const { rows: [profile] } = await db.query(
      "UPDATE investor_profiles SET onboarding_completed = true, onboarding_step = 9, completed_at = NOW() WHERE user_id = $1 RETURNING *",
      [userId]
    );
    if (!profile)
      return reply.code(404).send({ error: "Perfil não encontrado" });
    return reply.send({ profile, message: "Onboarding completo!" });
  });

  // GET /api/onboarding/summary
  fastify.get("/summary", async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(req);
    const { rows: [profile] } = await db.query(
      "SELECT investor_profile, risk_tolerance, investment_horizon, patrimony_range, monthly_income_cents, total_patrimony_cents, marital_status, primary_goal, experience_level, onboarding_completed, onboarding_step FROM investor_profiles WHERE user_id = $1",
      [userId]
    );
    if (!profile)
      return reply.send({ completed: false, summary: null });
    return reply.send({ completed: profile.onboarding_completed, summary: profile });
  });
}
