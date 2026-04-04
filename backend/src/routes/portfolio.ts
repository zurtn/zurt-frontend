import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/connection.js';

// ---------------------------------------------------------------------------
// In-memory cache (same pattern as market-data)
// ---------------------------------------------------------------------------
interface CacheEntry<T> { data: T; expiresAt: number; }
const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expiresAt) return entry.data as T;
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

// ---------------------------------------------------------------------------
// BRAPI helpers
// ---------------------------------------------------------------------------
const BRAPI_BASE = 'https://brapi.dev/api';
const BRAPI_TIMEOUT = 10_000;

async function brapiFetch<T>(path: string, token: string): Promise<T> {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${BRAPI_BASE}${path}${sep}token=${token}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BRAPI_TIMEOUT);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`BRAPI ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

// Regex to extract Brazilian tickers from investment names
const TICKER_RE = /\b([A-Z]{4}\d{1,2})\b/;

// Map Pluggy investment types to display labels
function mapInvestmentType(pluggyType: string | null): string {
  const t = (pluggyType || '').toUpperCase();
  if (t.includes('FIXED') || t.includes('CDB') || t.includes('LCI') || t.includes('LCA') || t.includes('DEBENTURE')) return 'Renda Fixa';
  if (t.includes('MUTUAL') || t.includes('FUND')) return 'Fundos';
  if (t.includes('EQUITY') || t.includes('STOCK')) return 'Renda Variavel';
  if (t.includes('TREASURY') || t.includes('TESOURO')) return 'Tesouro';
  if (t.includes('ETF')) return 'ETFs';
  if (t.includes('COE')) return 'COE';
  return 'Outros';
}

// Map account type to allocation category
function mapAccountType(accountType: string | null): { id: string; label: string; color: string } {
  const t = (accountType || '').toUpperCase();
  if (t.includes('SAVING') || t === 'SAVINGS') return { id: 'savings', label: 'Poupanca', color: '#F5A623' };
  return { id: 'checking', label: 'Conta Corrente', color: '#3B82F6' };
}

// Map investment type to allocation category
function investmentAllocationCategory(displayType: string): { id: string; label: string; color: string } {
  switch (displayType) {
    case 'Renda Fixa':
    case 'Tesouro':
      return { id: 'fixed', label: 'Renda Fixa', color: '#00D4AA' };
    case 'Renda Variavel':
    case 'ETFs':
      return { id: 'variable', label: 'Renda Variavel', color: '#8B5CF6' };
    case 'Fundos':
      return { id: 'funds', label: 'Fundos', color: '#3A86FF' };
    default:
      return { id: 'other', label: 'Outros', color: '#94A3B8' };
  }
}

// ===========================================================================
// Routes
// ===========================================================================

export async function portfolioRoutes(fastify: FastifyInstance) {

  // -----------------------------------------------------------------------
  // GET /summary — Consolidated portfolio
  // -----------------------------------------------------------------------
  fastify.get('/summary', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as any).userId;
    const token = process.env.BRAPI_TOKEN || '';

    try {
      // STEP 1: Fetch all Pluggy data in parallel from DB
      const [accountsRes, investmentsRes, flowRes, connectionsRes] = await Promise.allSettled([
        db.query(
          `SELECT pa.*, i.name as institution_name
           FROM pluggy_accounts pa
           LEFT JOIN connections c ON pa.item_id = c.external_consent_id AND c.user_id = $1
           LEFT JOIN institutions i ON c.institution_id = i.id
           WHERE pa.user_id = $1`,
          [userId],
        ),
        db.query('SELECT * FROM pluggy_investments WHERE user_id = $1', [userId]),
        db.query(
          `SELECT
            COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) as income,
            COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0) as expense
          FROM pluggy_transactions
          WHERE user_id = $1
            AND date >= DATE_TRUNC('month', CURRENT_DATE)
            AND date <= CURRENT_DATE`,
          [userId],
        ),
        db.query(
          `SELECT COUNT(*) as count FROM connections WHERE user_id = $1 AND status = 'ACTIVE'`,
          [userId],
        ),
      ]);

      const accounts = accountsRes.status === 'fulfilled' ? accountsRes.value.rows : [];
      const investments = investmentsRes.status === 'fulfilled' ? investmentsRes.value.rows : [];
      const flowRow = flowRes.status === 'fulfilled' && flowRes.value.rows[0] ? flowRes.value.rows[0] : { income: 0, expense: 0 };
      const connectionCount = connectionsRes.status === 'fulfilled' && connectionsRes.value.rows[0]
        ? parseInt(connectionsRes.value.rows[0].count, 10)
        : 0;

      // STEP 2: Extract tickers from investment names for BRAPI enrichment
      const tickerMap = new Map<string, number[]>(); // ticker -> indices into investments array
      for (let i = 0; i < investments.length; i++) {
        const match = (investments[i].name || '').match(TICKER_RE);
        if (match) {
          const ticker = match[1];
          if (!tickerMap.has(ticker)) tickerMap.set(ticker, []);
          tickerMap.get(ticker)!.push(i);
        }
      }

      // STEP 3: Fetch BRAPI data for extracted tickers + macro indicators (parallel)
      const tickers = Array.from(tickerMap.keys());
      let brapiResults: any[] = [];
      let macro: any = { selic: { value: 0 }, ipca: { value: 0 }, usd: { bid: 0, change: 0 }, ibov: { price: 0, change: 0 } };

      const brapiPromises: Promise<any>[] = [];

      // Batch quote for tickers
      if (tickers.length > 0) {
        brapiPromises.push(
          brapiFetch<any>(
            `/quote/${encodeURIComponent(tickers.join(','))}?fundamental=true&dividends=true&modules=summaryProfile,defaultKeyStatistics`,
            token,
          ).catch(() => ({ results: [] })),
        );
      } else {
        brapiPromises.push(Promise.resolve({ results: [] }));
      }

      // Macro indicators (use cache)
      const macroCacheKey = `portfolio:macro`;
      const cachedMacro = getCached<any>(macroCacheKey);
      if (cachedMacro) {
        brapiPromises.push(Promise.resolve(cachedMacro));
      } else {
        brapiPromises.push(
          Promise.allSettled([
            brapiFetch<any>('/v2/prime-rate?country=brazil', token),
            brapiFetch<any>('/v2/inflation?country=brazil', token),
            brapiFetch<any>('/v2/currency?currency=USD-BRL', token),
            brapiFetch<any>('/quote/^BVSP', token),
          ]).then(([selicRes, ipcaRes, usdRes, ibovRes]) => {
            const m: any = { selic: { value: 0 }, ipca: { value: 0 }, usd: { bid: 0, change: 0 }, ibov: { price: 0, change: 0 } };
            if (selicRes.status === 'fulfilled') {
              const rates = selicRes.value?.prime_rate ?? selicRes.value?.primeRate ?? [];
              if (Array.isArray(rates) && rates.length > 0) m.selic.value = parseFloat(rates[0]?.value ?? rates[0]?.rate ?? 0);
            }
            if (ipcaRes.status === 'fulfilled') {
              const inf = ipcaRes.value?.inflation ?? [];
              if (Array.isArray(inf) && inf.length > 0) m.ipca.value = parseFloat(inf[0]?.value ?? 0);
            }
            if (usdRes.status === 'fulfilled') {
              const cList = usdRes.value?.currency ?? usdRes.value?.currencies ?? [];
              if (Array.isArray(cList) && cList.length > 0) {
                m.usd.bid = parseFloat(cList[0]?.bidPrice ?? cList[0]?.bid ?? 0);
                m.usd.change = parseFloat(cList[0]?.percentageChange ?? cList[0]?.regularMarketChangePercent ?? cList[0]?.pctChange ?? 0);
              }
            }
            if (ibovRes.status === 'fulfilled') {
              const results = ibovRes.value?.results ?? [];
              if (results.length > 0) {
                m.ibov.price = results[0]?.regularMarketPrice ?? 0;
                m.ibov.change = results[0]?.regularMarketChangePercent ?? 0;
              }
            }
            setCache(macroCacheKey, m);
            return m;
          }).catch(() => ({ selic: { value: 0 }, ipca: { value: 0 }, usd: { bid: 0, change: 0 }, ibov: { price: 0, change: 0 } })),
        );
      }

      const [brapiData, macroData] = await Promise.all(brapiPromises);
      brapiResults = brapiData?.results ?? [];
      macro = macroData;

      // Index BRAPI results by symbol for fast lookup
      const brapiBySymbol = new Map<string, any>();
      for (const r of brapiResults) {
        if (r.symbol) brapiBySymbol.set(r.symbol, r);
      }

      // STEP 4: Build allocation map and positions
      const allocationMap = new Map<string, { id: string; label: string; value: number; color: string }>();

      // Accounts
      let totalAccounts = 0;
      for (const acc of accounts) {
        const bal = parseFloat(acc.current_balance || '0');
        if (bal === 0) continue;
        totalAccounts += bal;
        const cat = mapAccountType(acc.type);
        const existing = allocationMap.get(cat.id);
        if (existing) {
          existing.value += bal;
        } else {
          allocationMap.set(cat.id, { ...cat, value: bal });
        }
      }

      // Investments
      let totalInvestments = 0;
      const positions: any[] = [];

      for (let i = 0; i < investments.length; i++) {
        const inv = investments[i];
        const value = parseFloat(inv.current_value || '0');
        totalInvestments += value;

        const displayType = mapInvestmentType(inv.type);
        const allocCat = investmentAllocationCategory(displayType);
        const existing = allocationMap.get(allocCat.id);
        if (existing) {
          existing.value += value;
        } else {
          allocationMap.set(allocCat.id, { ...allocCat, value });
        }

        // Check if this investment has a matched BRAPI ticker
        const tickerMatch = (inv.name || '').match(TICKER_RE);
        const ticker = tickerMatch ? tickerMatch[1] : null;
        const brapi = ticker ? brapiBySymbol.get(ticker) : null;

        positions.push({
          name: ticker || inv.name || '',
          type: displayType,
          value,
          change: brapi ? (brapi.regularMarketChangePercent ?? null) : null,
          source: brapi ? 'brapi' : 'pluggy',
          logo: brapi?.logourl || null,
          fundamentals: brapi ? {
            pe: brapi.priceEarnings ?? brapi.defaultKeyStatistics?.trailingPE ?? null,
            dy: brapi.dividendYield ?? brapi.defaultKeyStatistics?.dividendYield ?? null,
          } : null,
        });
      }

      // Sort positions by value descending
      positions.sort((a, b) => b.value - a.value);

      // STEP 5: Build final response
      const totalPatrimonio = totalAccounts + totalInvestments;

      // Allocation array sorted by value descending
      const allocation = Array.from(allocationMap.values())
        .filter(a => a.value > 0)
        .sort((a, b) => b.value - a.value);

      // Flow
      const income = parseFloat(flowRow.income || '0');
      const expense = parseFloat(flowRow.expense || '0');

      // Last sync timestamp
      const lastSyncRes = await db.query(
        `SELECT MAX(last_sync_at) as last_sync FROM connections WHERE user_id = $1`,
        [userId],
      ).catch(() => ({ rows: [{ last_sync: null }] }));
      const lastSync = lastSyncRes.rows[0]?.last_sync || null;

      const result = {
        patrimonio: {
          total: totalPatrimonio,
          change: 0,
          changeValue: 0,
        },
        allocation,
        positions,
        flow: {
          income,
          expense,
          net: income - expense,
        },
        macro,
        connections: connectionCount,
        lastSync,
      };

      return reply.send(result);
    } catch (error: any) {
      fastify.log.error('Error building portfolio summary:', error);
      return reply.code(500).send({ error: 'Failed to build portfolio summary' });
    }
  });
}
