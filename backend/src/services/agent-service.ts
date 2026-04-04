import { db } from '../db/connection.js';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

// ===========================================================================
// Gather user financial context from all sources
// ===========================================================================

interface UserFinancialContext {
  accounts: any[];
  investments: any[];
  recentTransactions: any[];
  dollarAccount: any;
  connections: any[];
  totals: {
    bankBalance: number;
    investmentValue: number;
    creditCardDebt: number;
    dollarBalance: number;
    patrimony: number;
  };
  concentrationByInstitution: Record<string, number>;
  topCategories: any[];
  monthlyIncome: number;
  monthlyExpense: number;
}

async function getUserFinancialContext(userId: string): Promise<UserFinancialContext> {
  // Accounts with dedup
  const accountsResult = await db.query(`
    SELECT DISTINCT ON (pa.name) pa.name, pa.type, pa.current_balance, pa.updated_at,
      i.name as institution
    FROM pluggy_accounts pa
    LEFT JOIN connections c ON pa.item_id = c.external_consent_id::text AND c.user_id = pa.user_id
    LEFT JOIN institutions i ON c.institution_id = i.id
    WHERE pa.user_id = $1
    ORDER BY pa.name, pa.updated_at DESC NULLS LAST
  `, [userId]);

  // Investments with dedup
  const investResult = await db.query(`
    SELECT DISTINCT ON (name) name, type, current_value, quantity, updated_at
    FROM pluggy_investments
    WHERE user_id = $1
    ORDER BY name, updated_at DESC
  `, [userId]);

  // Recent transactions (30 days)
  const txResult = await db.query(`
    SELECT description, amount, date, category, status
    FROM pluggy_transactions
    WHERE user_id = $1 AND date >= NOW() - INTERVAL '30 days'
    ORDER BY date DESC
    LIMIT 100
  `, [userId]);

  // Dollar account
  const dollarResult = await db.query(`
    SELECT usdc_balance, accumulated_yield, yield_enabled FROM dollar_accounts WHERE user_id = $1
  `, [userId]);

  // Connections
  const connResult = await db.query(`
    SELECT provider, status, last_sync_at FROM connections WHERE user_id = $1
  `, [userId]);

  // Top spending categories (30 days)
  const catResult = await db.query(`
    SELECT category, SUM(ABS(amount)) as total, COUNT(*) as count
    FROM pluggy_transactions
    WHERE user_id = $1 AND date >= NOW() - INTERVAL '30 days' AND amount < 0
    GROUP BY category ORDER BY total DESC LIMIT 10
  `, [userId]);

  // Monthly income/expense
  const flowResult = await db.query(`
    SELECT
      COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) as income,
      COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0) as expense
    FROM pluggy_transactions
    WHERE user_id = $1 AND date >= NOW() - INTERVAL '30 days'
  `, [userId]);

  const accounts = accountsResult.rows;
  const investments = investResult.rows;
  const dollar = dollarResult.rows[0] || { usdc_balance: 0, accumulated_yield: 0 };

  let bankBalance = 0;
  let creditCardDebt = 0;
  for (const acc of accounts) {
    const bal = parseFloat(acc.current_balance || '0');
    if (acc.type === 'CREDIT_CARD' || acc.type === 'CREDIT') {
      creditCardDebt += bal;
    } else {
      bankBalance += bal;
    }
  }

  const investmentValue = investments.reduce((sum: number, inv: any) => sum + parseFloat(inv.current_value || '0'), 0);
  const dollarBrl = parseFloat(dollar.usdc_balance || '0') * 5.25;

  // Concentration by institution
  const concentration: Record<string, number> = {};
  for (const acc of accounts) {
    const inst = acc.institution || 'Desconhecido';
    const bal = Math.abs(parseFloat(acc.current_balance || '0'));
    concentration[inst] = (concentration[inst] || 0) + bal;
  }

  return {
    accounts,
    investments,
    recentTransactions: txResult.rows,
    dollarAccount: dollar,
    connections: connResult.rows,
    totals: {
      bankBalance,
      investmentValue,
      creditCardDebt,
      dollarBalance: parseFloat(dollar.usdc_balance || '0'),
      patrimony: bankBalance + investmentValue + dollarBrl - creditCardDebt,
    },
    concentrationByInstitution: concentration,
    topCategories: catResult.rows,
    monthlyIncome: parseFloat(flowResult.rows[0]?.income || '0'),
    monthlyExpense: parseFloat(flowResult.rows[0]?.expense || '0'),
  };
}

// ===========================================================================
// Build system prompt for Claude
// ===========================================================================

function buildSystemPrompt(context: UserFinancialContext): string {
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const institutionList = Object.entries(context.concentrationByInstitution)
    .sort((a, b) => b[1] - a[1])
    .map(([inst, val]) => `  - ${inst}: ${fmt(val)} (${((val / Math.max(context.totals.patrimony, 1)) * 100).toFixed(1)}%)`)
    .join('\n');

  const investList = context.investments
    .map(inv => `  - ${inv.name} (${inv.type}): ${fmt(parseFloat(inv.current_value || '0'))}`)
    .join('\n') || '  Nenhum investimento conectado';

  const topCats = context.topCategories.slice(0, 5)
    .map(c => `  - ${c.category || 'Sem categoria'}: ${fmt(parseFloat(c.total))} (${c.count} transações)`)
    .join('\n') || '  Sem dados de gastos';

  return `Você é o ZURT Agent, um assessor financeiro inteligente integrado à plataforma ZURT — a plataforma brasileira de inteligência patrimonial.

REGRAS ABSOLUTAS:
- Responda SEMPRE em português brasileiro
- Seja direto, técnico e objetivo — o usuário é investidor brasileiro
- Use dados REAIS do patrimônio do usuário (fornecidos abaixo)
- NUNCA invente números — use apenas os dados fornecidos
- Dê insights ACIONÁVEIS, não genéricos
- Formate valores em R$ brasileiro
- Mantenha respostas concisas (máximo 3 parágrafos)
- Taxa Selic atual: 14,75% a.a.
- Use emojis com moderação (máximo 2 por resposta)

DADOS DO PATRIMÔNIO DO USUÁRIO:
Patrimônio total: ${fmt(context.totals.patrimony)}
Saldo em contas: ${fmt(context.totals.bankBalance)}
Investimentos: ${fmt(context.totals.investmentValue)}
Dívida cartão de crédito: ${fmt(context.totals.creditCardDebt)}
Saldo dólar digital: $${context.totals.dollarBalance.toFixed(2)} USDC

Concentração por instituição:
${institutionList}

Investimentos:
${investList}

Maiores categorias de gasto (30 dias):
${topCats}

Fluxo mensal:
  Receita: ${fmt(context.monthlyIncome)}
  Despesa: ${fmt(context.monthlyExpense)}
  Saldo: ${fmt(context.monthlyIncome - context.monthlyExpense)}

Conexões Open Finance: ${context.connections.length} instituições
Dólar digital: ${context.dollarAccount.yield_enabled ? 'Rendimento USDC ativado' : 'Rendimento USDC não ativado'}`;
}

// ===========================================================================
// Call Claude API
// ===========================================================================

async function callClaude(systemPrompt: string, userMessage: string, conversationHistory: any[] = []): Promise<string> {
  const messages = [
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json() as any;
  return data.content?.[0]?.text || 'Sem resposta do agente.';
}

// ===========================================================================
// Generate automatic insights (no user message needed)
// ===========================================================================

async function generateAutoInsights(userId: string): Promise<string[]> {
  const context = await getUserFinancialContext(userId);
  const insights: string[] = [];
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // 1. Concentration risk
  const entries = Object.entries(context.concentrationByInstitution).sort((a, b) => b[1] - a[1]);
  if (entries.length > 0 && context.totals.patrimony > 0) {
    const topInst = entries[0];
    const totalPositive = context.totals.bankBalance + context.totals.investmentValue + (context.totals.dollarBalance * 5.25); const pct = totalPositive > 0 ? (topInst[1] / totalPositive) * 100 : 0;
    if (pct > 60) {
      insights.push(`⚠️ ${pct.toFixed(0)}% do seu patrimônio está concentrado em ${topInst[0]}. Considere diversificar entre instituições para reduzir risco.`);
    }
  }

  // 2. Credit card debt vs investments
  if (context.totals.creditCardDebt > 1000 && context.totals.investmentValue > 0) {
    insights.push(`💳 Você tem ${fmt(context.totals.creditCardDebt)} em faturas de cartão. Com juros de cartão acima de 400% a.a., priorize quitar antes de novos investimentos.`);
  }

  // 3. Cash sitting idle
  if (context.totals.bankBalance > 5000) {
    const rendaMensal = context.totals.bankBalance * 0.1475 / 12;
    insights.push(`💰 Você tem ${fmt(context.totals.bankBalance)} parado em conta corrente. Na Selic atual (14,75%), isso renderia ~${fmt(rendaMensal)}/mês num CDB 100% CDI.`);
  }

  // 4. Dollar exposure
  if (context.totals.dollarBalance === 0 && context.totals.patrimony > 10000) {
    insights.push(`🌎 Seu patrimônio está 100% em reais. Considere dolarizar 10-20% via USDC para proteção cambial.`);
  } else if (context.totals.dollarBalance > 0) {
    const totalPos2 = context.totals.bankBalance + context.totals.investmentValue + (context.totals.dollarBalance * 5.25); const dollarPct = totalPos2 > 0 ? (context.totals.dollarBalance * 5.25 / totalPos2) * 100 : 0;
    insights.push(`🇺🇸 Exposição cambial: ${dollarPct.toFixed(1)}% do patrimônio em dólar ($${context.totals.dollarBalance.toFixed(2)} USDC).`);
  }

  // 5. Spending pattern
  if (context.monthlyExpense > context.monthlyIncome * 0.9 && context.monthlyIncome > 0) {
    const ratio = (context.monthlyExpense / context.monthlyIncome * 100).toFixed(0);
    insights.push(`📊 Alerta: seus gastos representam ${ratio}% da sua receita mensal. Margem de poupança muito baixa.`);
  }

  // 6. Stale connections
  const stale = context.connections.filter(c => {
    if (!c.last_sync_at) return true;
    return new Date(c.last_sync_at).getTime() < Date.now() - 7 * 86400000;
  });
  if (stale.length > 0) {
    insights.push(`🔄 ${stale.length} conexão(ões) bancária(s) desatualizada(s). Sincronize para manter seu painel preciso.`);
  }

  return insights.length > 0 ? insights : ['✅ Seu patrimônio está bem distribuído. Continue acompanhando pelo ZURT.'];
}

// ===========================================================================
// Public API
// ===========================================================================

export async function chat(userId: string, message: string, history: any[] = []): Promise<string> {
  const context = await getUserFinancialContext(userId);
  const systemPrompt = buildSystemPrompt(context);
  return callClaude(systemPrompt, message, history);
}

export async function getInsights(userId: string): Promise<string[]> {
  return generateAutoInsights(userId);
}

export async function getSmartInsight(userId: string): Promise<string> {
  const context = await getUserFinancialContext(userId);
  const systemPrompt = buildSystemPrompt(context);
  const prompt = `Analise o patrimônio do usuário e gere UM insight principal — o mais importante e acionável neste momento. Máximo 2 frases. Seja específico com números reais.`;
  return callClaude(systemPrompt, prompt);
}
