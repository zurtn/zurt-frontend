import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// ---------------------------------------------------------------------------
// In-memory cache for macro indicators (SELIC, IPCA, currencies change slowly)
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
// BRAPI fetch helper with 10s timeout
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

// ===========================================================================
// Routes
// ===========================================================================

export async function marketDataRoutes(fastify: FastifyInstance) {

  // -----------------------------------------------------------------------
  // GET /indicators — SELIC + IPCA + currencies + indices + crypto
  // -----------------------------------------------------------------------
  fastify.get('/indicators', {
    preHandler: [fastify.authenticate],
  }, async (_request: FastifyRequest, reply: FastifyReply) => {
    const cacheKey = 'indicators';
    const cached = getCached<any>(cacheKey);
    if (cached) return reply.send(cached);

    const token = process.env.BRAPI_TOKEN || '';

    try {
      const [primeRes, inflationRes, currencyRes, indicesRes, cryptoRes] = await Promise.allSettled([
        brapiFetch<any>('/v2/prime-rate?country=brazil', token),
        brapiFetch<any>('/v2/inflation?country=brazil', token),
        brapiFetch<any>('/v2/currency?currency=USD-BRL,EUR-BRL', token),
        brapiFetch<any>('/quote/^BVSP,IFIX', token),
        brapiFetch<any>('/v2/crypto?coin=BTC&currency=BRL', token),
      ]);

      // SELIC — BRAPI returns { "prime-rate": [{ value: "15.00", date: "28/02/2026", ... }] }
      let selic = { value: 0, date: '' };
      if (primeRes.status === 'fulfilled') {
        const raw = primeRes.value;
        // The key is literally "prime-rate" (with hyphen)
        const rates = raw?.['prime-rate'] ?? raw?.prime_rate ?? raw?.primeRate ?? [];
        if (Array.isArray(rates) && rates.length > 0) {
          selic.value = parseFloat(rates[0]?.value ?? rates[0]?.rate ?? 0);
          selic.date = rates[0]?.date ?? '';
        }
      }

      // IPCA
      let inflation = { value: 0, date: '' };
      if (inflationRes.status === 'fulfilled') {
        const inf = inflationRes.value?.inflation ?? [];
        if (Array.isArray(inf) && inf.length > 0) {
          inflation.value = parseFloat(inf[0]?.value ?? 0);
          inflation.date = inf[0]?.date ?? '';
        }
      }

      // Currencies — return in format frontend expects
      let currencies: any[] = [];
      if (currencyRes.status === 'fulfilled') {
        const cList = currencyRes.value?.currency ?? currencyRes.value?.currencies ?? [];
        currencies = (Array.isArray(cList) ? cList : []).map((c: any) => ({
          fromCurrency: c.fromCurrency ?? '',
          toCurrency: c.toCurrency ?? '',
          name: c.name ?? '',
          bidPrice: String(c.bidPrice ?? c.bid ?? 0),
          askPrice: String(c.askPrice ?? c.ask ?? 0),
          percentageChange: String(c.percentageChange ?? c.regularMarketChangePercent ?? c.pctChange ?? 0),
          updatedAt: c.updatedAtDate ?? new Date().toISOString(),
        }));
      }

      // Ibovespa
      let ibovespa = { points: 0, changePercent: 0 };
      if (indicesRes.status === 'fulfilled') {
        const results = indicesRes.value?.results ?? [];
        const bvsp = results.find((r: any) => r.symbol === '^BVSP');
        if (bvsp) {
          ibovespa.points = bvsp.regularMarketPrice ?? 0;
          ibovespa.changePercent = bvsp.regularMarketChangePercent ?? 0;
        }
      }

      // Crypto (BTC for the ticker bar)
      let crypto: any[] = [];
      if (cryptoRes.status === 'fulfilled') {
        crypto = (cryptoRes.value?.coins ?? []).map((c: any) => ({
          coin: c.coin ?? '',
          coinName: c.coinName ?? '',
          regularMarketPrice: c.regularMarketPrice ?? 0,
          regularMarketChangePercent: c.regularMarketChangePercent ?? 0,
          marketCap: c.marketCap ?? 0,
          logoUrl: c.coinImageUrl ?? '',
        }));
      }

      const result = {
        ibovespa,
        currencies,
        crypto,
        selic,
        inflation,
        updatedAt: new Date().toISOString(),
      };
      setCache(cacheKey, result);
      return reply.send(result);
    } catch (error: any) {
      fastify.log.error('Error fetching indicators:', error);
      return reply.code(500).send({ error: 'Failed to fetch market indicators' });
    }
  });

  // -----------------------------------------------------------------------
  // GET /crypto — Top cryptos in BRL
  // -----------------------------------------------------------------------
  fastify.get('/crypto', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { coins: coinsParam } = request.query as any;
    const coinList = coinsParam || 'BTC,ETH,SOL,ADA,DOT,AVAX,MATIC,LINK,UNI,DOGE,BNB,XRP,USDT,USDC,LTC,ATOM,XLM,SHIB,TON,TRX';
    const cacheKey = `crypto:${coinList}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return reply.send(cached);

    const token = process.env.BRAPI_TOKEN || '';
    try {
      const data = await brapiFetch<any>(`/v2/crypto?coin=${encodeURIComponent(coinList)}&currency=BRL`, token);
      const mapped = (data?.coins ?? []).map((c: any) => ({
        coin: c.coin ?? '',
        coinName: c.coinName ?? c.coin ?? '',
        regularMarketPrice: c.regularMarketPrice ?? 0,
        regularMarketChangePercent: c.regularMarketChangePercent ?? 0,
        marketCap: c.marketCap ?? 0,
        logoUrl: c.coinImageUrl ?? '',
      }));
      // Return as "coins" to match frontend expectation (fetchMarketCrypto does data.coins)
      const result = { coins: mapped, updatedAt: new Date().toISOString() };
      setCache(cacheKey, result);
      return reply.send(result);
    } catch (error: any) {
      fastify.log.error('Error fetching crypto:', error);
      return reply.code(500).send({ error: 'Failed to fetch crypto data' });
    }
  });

  // -----------------------------------------------------------------------
  // GET /currency/:pair — Specific currency pair(s)
  // -----------------------------------------------------------------------
  fastify.get('/currency/:pair', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { pair } = request.params as any;
    const cacheKey = `currency:${pair}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return reply.send(cached);

    const token = process.env.BRAPI_TOKEN || '';
    try {
      const data = await brapiFetch<any>(`/v2/currency?currency=${encodeURIComponent(pair)}`, token);
      const list = data?.currency ?? data?.currencies ?? [];
      const mapped = (Array.isArray(list) ? list : []).map((c: any) => ({
        fromCurrency: c.fromCurrency ?? '',
        toCurrency: c.toCurrency ?? '',
        name: c.name ?? '',
        bidPrice: String(c.bidPrice ?? c.bid ?? 0),
        askPrice: String(c.askPrice ?? c.ask ?? 0),
        percentageChange: String(c.percentageChange ?? c.regularMarketChangePercent ?? c.pctChange ?? 0),
        updatedAt: c.updatedAtDate ?? new Date().toISOString(),
      }));
      if (mapped.length === 0) return reply.code(404).send({ error: 'Currency pair not found' });

      const result = { currency: mapped, updatedAt: new Date().toISOString() };
      setCache(cacheKey, result);
      return reply.send(result);
    } catch (error: any) {
      fastify.log.error('Error fetching currency:', error);
      return reply.code(500).send({ error: 'Failed to fetch currency data' });
    }
  });

  // -----------------------------------------------------------------------
  // GET /quote/batch — Multiple tickers in one call (max 20)
  // -----------------------------------------------------------------------
  fastify.get('/quote/batch', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { tickers } = request.query as any;
    if (!tickers) return reply.code(400).send({ error: 'Missing ?tickers= parameter' });

    const list = String(tickers).split(',').slice(0, 20).map(t => t.trim()).filter(Boolean);
    if (list.length === 0) return reply.code(400).send({ error: 'No valid tickers provided' });

    const token = process.env.BRAPI_TOKEN || '';
    try {
      const joined = list.join(',');
      // BRAPI returns { results: [{ symbol, regularMarketPrice, ... }] }
      const data = await brapiFetch<any>(
        `/quote/${encodeURIComponent(joined)}?fundamental=false`,
        token,
      );
      const quotes = (data?.results ?? []).map((r: any) => ({
        symbol: r.symbol ?? '',
        shortName: r.shortName ?? '',
        longName: r.longName ?? '',
        regularMarketPrice: r.regularMarketPrice ?? 0,
        regularMarketChange: r.regularMarketChange ?? 0,
        regularMarketChangePercent: r.regularMarketChangePercent ?? 0,
        regularMarketVolume: r.regularMarketVolume ?? 0,
        marketCap: r.marketCap ?? 0,
        logourl: r.logourl ?? '',
      }));
      // Return as "results" to match BrapiQuote[] expected by frontend
      return reply.send({ results: quotes });
    } catch (error: any) {
      fastify.log.error('Error fetching batch quotes:', error);
      return reply.code(500).send({ error: 'Failed to fetch batch quotes' });
    }
  });

  // -----------------------------------------------------------------------
  // GET /quote/:ticker/full — Single ticker with ALL modules
  // -----------------------------------------------------------------------
  fastify.get('/quote/:ticker/full', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { ticker } = request.params as any;
    const token = process.env.BRAPI_TOKEN || '';
    try {
      const data = await brapiFetch<any>(
        `/quote/${encodeURIComponent(ticker)}?fundamental=true&dividends=true&range=1y&interval=1d&modules=summaryProfile,defaultKeyStatistics,financialData,balanceSheetHistory,incomeStatementHistory,cashflowHistory,earningsHistory`,
        token,
      );
      return reply.send(data);
    } catch (error: any) {
      fastify.log.error('Error fetching full quote:', error);
      return reply.code(500).send({ error: 'Failed to fetch full quote data' });
    }
  });

  // -----------------------------------------------------------------------
  // GET /trending — Most traded stocks today
  // -----------------------------------------------------------------------
  fastify.get('/trending', {
    preHandler: [fastify.authenticate],
  }, async (_request: FastifyRequest, reply: FastifyReply) => {
    const cacheKey = 'trending';
    const cached = getCached<any>(cacheKey);
    if (cached) return reply.send(cached);

    const token = process.env.BRAPI_TOKEN || '';
    try {
      // BRAPI /api/quote/list returns { stocks: [{ stock, name, close, ... }] }
      const data = await brapiFetch<any>('/quote/list?sortBy=volume&sortOrder=desc&limit=10', token);
      const stocks = (data?.stocks ?? []).map((s: any) => ({
        symbol: s.stock ?? s.symbol ?? '',
        name: s.name ?? '',
        price: s.close ?? 0,
        change: s.change ?? 0,
        volume: s.volume ?? 0,
        logo: s.logo ?? null,
        sector: s.sector ?? null,
      }));
      const result = { stocks, updatedAt: new Date().toISOString() };
      setCache(cacheKey, result);
      return reply.send(result);
    } catch (error: any) {
      fastify.log.error('Error fetching trending:', error);
      return reply.code(500).send({ error: 'Failed to fetch trending stocks' });
    }
  });
}
