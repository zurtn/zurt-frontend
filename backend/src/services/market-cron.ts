import cron from 'node-cron';
import { sendPushToAll, sendPushToTokens } from './push-service.js';
import { db } from '../db/connection.js';

const BRAPI_TOKEN = process.env.BRAPI_TOKEN || '';

// IBOV composition - update quarterly (Jan, May, Sep)
const IBOV_TICKERS = new Set([
  'ALOS3','ABEV3','ASAI3','AURE3','AZUL4','AZZA3','B3SA3','BBAS3','BBDC3','BBDC4',
  'BBSE3','BEEF3','BPAC11','BRAP4','BRFS3','BRKM5','CASH3','CCRO3','CIEL3','CMIG4',
  'COGN3','CPFE3','CPLE6','CRFB3','CSAN3','CSNA3','CVCB3','CXSE3','CYRE3','DXCO3',
  'ECOR3','EGIE3','ELET3','ELET6','EMBR3','ENEV3','ENGI11','EQTL3','EZTC3','FLRY3',
  'GGBR4','GOAU4','GOLL4','HAPV3','HYPE3','IGTI11','IRBR3','ITSA4','ITUB4','JBSS3',
  'KLBN11','LREN3','LWSA3','MGLU3','MRFG3','MRVE3','MULT3','NTCO3','PCAR3','PETR3',
  'PETR4','PETZ3','POSI3','PRIO3','QUAL3','RADL3','RAIL3','RAIZ4','RDOR3','RECV3',
  'RENT3','RRRP3','SANB11','SBSP3','SLCE3','SMTO3','SUZB3','TAEE11','TIMS3','TOTS3',
  'UGPA3','USIM5','VALE3','VAMO3','VBBR3','VIVA3','VIVT3','WEGE3','YDUQ3',
]);

// IBOV composition - update quarterly (Jan, May, Sep)


interface BrapiQuote {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
}

async function fetchMarketClose(): Promise<{ ibov: { points: number; change: number } | null; top5: BrapiQuote[]; bottom5: BrapiQuote[] }> {
  try {
    const ibovRes = await fetch(`https://brapi.dev/api/quote/%5EBVSP?token=${BRAPI_TOKEN}`);
    const ibovData = await ibovRes.json() as any;
    const ibovQuote = ibovData?.results?.[0];
    const ibov = ibovQuote ? {
      points: Math.round(ibovQuote.regularMarketPrice),
      change: parseFloat((ibovQuote.regularMarketChangePercent || 0).toFixed(2)),
    } : null;

    // Fetch top gainers (desc) and top losers (asc) separately
    const [gainRes, loseRes] = await Promise.all([
      fetch(`https://brapi.dev/api/quote/list?sortBy=change&sortOrder=desc&limit=200&type=stock&token=${BRAPI_TOKEN}`),
      fetch(`https://brapi.dev/api/quote/list?sortBy=change&sortOrder=asc&limit=200&type=stock&token=${BRAPI_TOKEN}`),
    ]);
    const gainData = await gainRes.json() as any;
    const loseData = await loseRes.json() as any;

    const filterStocks = (raw: any[]): BrapiQuote[] => raw
      .filter((s: any) => {
        if (s.change === null || s.change === undefined) return false;
        const sym = s.stock || '';
        if (!IBOV_TICKERS.has(sym)) return false; // only IBOV stocks
        return true;
      })
      .map((s: any) => ({
        symbol: s.stock,
        shortName: s.name || s.stock,
        regularMarketPrice: s.close || 0,
        regularMarketChangePercent: s.change || 0,
      }));

    const gainers = filterStocks(gainData?.stocks || []).sort((a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent);
    const losers = filterStocks(loseData?.stocks || []).sort((a, b) => a.regularMarketChangePercent - b.regularMarketChangePercent);
    const top5 = gainers.slice(0, 5);
    const bottom5 = losers.slice(0, 5);
    return { ibov, top5, bottom5 };
  } catch (err: any) {
    console.error('[MarketCron] BRAPI fetch error:', err.message);
    return { ibov: null, top5: [], bottom5: [] };
  }
}

export async function sendMarketCloseNotification(): Promise<void> {
  console.log('[MarketCron] Fetching market data...');
  const { ibov, top5, bottom5 } = await fetchMarketClose();
  if (top5.length === 0 && bottom5.length === 0) {
    console.log('[MarketCron] No data available, skipping');
    return;
  }
  const greenLine = top5.slice(0, 3).map(s => `${s.symbol} +${s.regularMarketChangePercent.toFixed(1)}%`).join(' \u00b7 ');
  const redLine = bottom5.slice(0, 3).map(s => `${s.symbol} ${s.regularMarketChangePercent.toFixed(1)}%`).join(' \u00b7 ');
  const title = '\ud83d\udcca Mercado Fechou \u2014 Destaques do Dia';
  const body = `\ud83d\udfe2 ${greenLine}\n\ud83d\udfe0 ${redLine}`;

  try {
    await db.query(
      `INSERT INTO market_snapshots (snapshot_date, ibov_points, ibov_change, top_movers, bottom_movers, created_at)
       VALUES (CURRENT_DATE, $1, $2, $3, $4, NOW())
       ON CONFLICT (snapshot_date) DO UPDATE SET ibov_points = $1, ibov_change = $2, top_movers = $3, bottom_movers = $4, created_at = NOW()`,
      [ibov?.points || 0, ibov?.change || 0, JSON.stringify(top5), JSON.stringify(bottom5)]
    );
  } catch (err: any) {
    console.error('[MarketCron] DB save error:', err.message);
  }

  const sent = await sendPushToAll(title, body, { type: 'market_close', screen: '/market-close', date: new Date().toISOString() }, 'system');
  console.log(`[MarketCron] Market close notification sent to ${sent} users`);
}

export async function sendDailyInsights(): Promise<void> {
  console.log('[InsightsCron] Generating personalized insights via Claude...');
  
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
  if (!ANTHROPIC_API_KEY) {
    console.log('[InsightsCron] No Anthropic API key, skipping');
    return;
  }

  // Get all active users with push tokens
  const users = await db.query(`
    SELECT DISTINCT u.id, u.push_token, u.full_name FROM users u
    WHERE u.push_token IS NOT NULL AND u.is_active = true
    AND EXISTS (
      SELECT 1 FROM subscriptions s 
      WHERE s.user_id = u.id AND s.status = 'active'
    )
  `);

  if (users.rows.length === 0) {
    console.log('[InsightsCron] No users with push tokens');
    return;
  }

  // Fetch macro data once (shared across all users)
  let selic = '14.75';
  let usdBrl = '5.25';
  let ibovChange = '0';
  try {
    const [selicRes, usdRes] = await Promise.all([
      fetch(`https://brapi.dev/api/v2/prime-rate?country=brazil&sortBy=date&sortOrder=desc&token=${BRAPI_TOKEN}`),
      fetch('https://economia.awesomeapi.com.br/last/USD-BRL'),
    ]);
    const selicData = await selicRes.json() as any;
    const rates = selicData?.['prime-rate'] ?? selicData?.prime_rate ?? [];
    selic = rates?.[0]?.value ?? '14.75';
    const usdData = await usdRes.json() as any;
    usdBrl = parseFloat(usdData?.USDBRL?.bid || '5.25').toFixed(2);
  } catch {}

  let sent = 0;
  for (const user of users.rows) {
    try {
      // Get user financial snapshot
      const acctResult = await db.query(`
        SELECT DISTINCT ON (pa.name) pa.type, pa.current_balance
        FROM pluggy_accounts pa
        WHERE pa.user_id = $1
        ORDER BY pa.name, pa.updated_at DESC NULLS LAST
      `, [user.id]);

      const investResult = await db.query(`
        SELECT DISTINCT ON (name) name, current_value
        FROM pluggy_investments WHERE user_id = $1
        ORDER BY name, updated_at DESC
      `, [user.id]);

      const dollarResult = await db.query(`
        SELECT usdc_balance FROM dollar_accounts WHERE user_id = $1
      `, [user.id]);

      let bankBalance = 0;
      let creditDebt = 0;
      for (const acc of acctResult.rows) {
        const bal = parseFloat(acc.current_balance || '0');
        if (acc.type === 'CREDIT_CARD' || acc.type === 'CREDIT') creditDebt += bal;
        else bankBalance += bal;
      }
      const investTotal = investResult.rows.reduce((s: number, i: any) => s + parseFloat(i.current_value || '0'), 0);
      const usdcBal = parseFloat(dollarResult.rows[0]?.usdc_balance || '0');
      const patrimony = bankBalance + investTotal + (usdcBal * parseFloat(usdBrl)) - creditDebt;
      const firstName = (user.full_name || '').split(' ')[0] || '';

      // Skip users with no financial data
      if (acctResult.rows.length === 0 && investResult.rows.length === 0) continue;

      // Call Claude to generate personalized insight
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 150,
          system: `Voce e um assessor de private banking senior da ZURT. Gere UMA notificacao push curta (max 120 chars) e personalizada para o investidor. Use dados reais. Seja direto, tecnico, sem emojis excessivos. Maximo 1 emoji no inicio. Nao use markdown. Contexto macro: Selic ${selic}% a.a., USD/BRL R$ ${usdBrl}.`,
          messages: [{
            role: 'user',
            content: `Dados do investidor ${firstName || 'cliente'}:
- Patrimonio: R$ ${patrimony.toFixed(0)}
- Saldo em conta: R$ ${bankBalance.toFixed(0)}
- Investimentos: R$ ${investTotal.toFixed(0)}
- Divida cartao: R$ ${creditDebt.toFixed(0)}
- Dolar digital: $${usdcBal.toFixed(2)} USDC
- Numero de contas: ${acctResult.rows.length}

Gere uma frase curta de insight acionavel para push notification. Max 120 caracteres.`
          }],
        }),
      });

      if (!res.ok) {
        console.error('[InsightsCron] Claude error:', res.status);
        continue;
      }

      const data = await res.json() as any;
      const insight = (data.content?.[0]?.text || '').trim();
      if (!insight) continue;

      await sendPushToTokens([user.push_token], '💡 ZURT Insight', insight, { type: 'smart_insight', screen: '/(tabs)/agent' });
      sent++;

      // Rate limit: small delay between users to not hammer Claude API
      await new Promise(r => setTimeout(r, 500));
    } catch (err: any) {
      console.error(`[InsightsCron] Error for user ${user.id}:`, err.message);
    }
  }
  console.log(`[InsightsCron] Personalized insights sent to ${sent}/${users.rows.length} users`);
}

export function startMarketCrons(): void {
  cron.schedule('45 17 * * 1-5', () => {
    console.log('[MarketCron] Running market close job...');
    sendMarketCloseNotification().catch(err => console.error('[MarketCron] Error:', err));
  }, { timezone: 'America/Sao_Paulo' });

  cron.schedule('0 9 * * 1-5', () => {
    console.log('[InsightsCron] Running morning insight...');
    sendDailyInsights().catch(err => console.error('[InsightsCron] Error:', err));
  }, { timezone: 'America/Sao_Paulo' });

  cron.schedule('0 14 * * 1-5', () => {
    console.log('[InsightsCron] Running afternoon insight...');
    sendDailyInsights().catch(err => console.error('[InsightsCron] Error:', err));
  }, { timezone: 'America/Sao_Paulo' });

  console.log('[MarketCron] Scheduled: Market close (17:45), Insights (9:00, 14:00) - Mon-Fri BRT');
}
