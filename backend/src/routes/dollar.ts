import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  getUSDCTicker,
  getUSDCOrderbook,
  generateQuote,
  executeOrder,
  getDollarAccount,
  getTransactionHistory,
  getYieldHistory,
} from '../services/mb-client.js';

export async function dollarRoutes(fastify: FastifyInstance) {
  // Auth hook
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  const getUserId = (request: any) => request.user.userId;

  // =========================================================================
  // GET /api/dollar/account — saldo + info da conta
  // =========================================================================
  fastify.get('/account', async (request, reply) => {
    try {
      const userId = getUserId(request);
      const account = await getDollarAccount(userId);
      const ticker = await getUSDCTicker().catch(() => null);

      const usdcBalance = parseFloat(account.usdc_balance || '0');
      const rate = ticker ? parseFloat(ticker.buy) : 0;

      return {
        usdc_balance: usdcBalance,
        brl_equivalent: Math.round(usdcBalance * rate * 100) / 100,
        current_rate: rate,
        yield_enabled: account.yield_enabled,
        accumulated_yield: parseFloat(account.accumulated_yield || '0'),
        total_yield: parseFloat(account.total_yield || '0'),
        total_transactions: parseInt(account.total_transactions || '0'),
      };
    } catch (error: any) {
      fastify.log.error('Error fetching dollar account: ' + (error instanceof Error ? error.message : String(error)));
      return reply.code(500).send({ error: 'Erro ao carregar conta' });
    }
  });

  // =========================================================================
  // GET /api/dollar/quote — cotação com spread
  // =========================================================================
  fastify.get('/quote', async (request: FastifyRequest, reply) => {
    try {
      const { type, amount } = request.query as { type: 'buy' | 'sell'; amount: string };

      if (!type || !amount || isNaN(parseFloat(amount))) {
        return reply.code(400).send({ error: 'Parâmetros inválidos: type (buy|sell) e amount são obrigatórios' });
      }

      const numAmount = parseFloat(amount);
      if (numAmount <= 0) {
        return reply.code(400).send({ error: 'Valor deve ser maior que zero' });
      }

      const quote = type === 'buy'
        ? await generateQuote('buy', numAmount)
        : await generateQuote('sell', undefined, numAmount);

      return quote;
    } catch (error: any) {
      fastify.log.error('Error generating quote: ' + (error instanceof Error ? error.message : String(error)));
      return reply.code(500).send({ error: 'Erro ao gerar cotação' });
    }
  });

  // =========================================================================
  // POST /api/dollar/convert — executar dolarização (BRL → USDC)
  // =========================================================================
  fastify.post('/convert', async (request: FastifyRequest, reply) => {
    try {
      const userId = getUserId(request);
      const { brlAmount } = request.body as { brlAmount: number };

      if (!brlAmount || brlAmount < 10) {
        return reply.code(400).send({ error: 'Valor mínimo: R$ 10,00' });
      }

      // Generate fresh quote
      const quote = await generateQuote('buy', brlAmount);

      // Execute
      const result = await executeOrder(userId, 'buy', brlAmount, quote.usdcAmount, quote.effectiveRate);

      return {
        success: true,
        orderId: result.orderId,
        brlAmount,
        usdcAmount: quote.usdcAmount,
        effectiveRate: quote.effectiveRate,
        spread: quote.spread,
        fee: result.fee,
        status: result.status,
      };
    } catch (error: any) {
      fastify.log.error('Error converting to USDC: ' + (error instanceof Error ? error.message : String(error)));
      return reply.code(500).send({ error: error.message || 'Erro na conversão' });
    }
  });

  // =========================================================================
  // POST /api/dollar/redeem — resgatar (USDC → BRL)
  // =========================================================================
  fastify.post('/redeem', async (request: FastifyRequest, reply) => {
    try {
      const userId = getUserId(request);
      const { usdcAmount } = request.body as { usdcAmount: number };

      if (!usdcAmount || usdcAmount < 1) {
        return reply.code(400).send({ error: 'Valor mínimo: 1 USDC' });
      }

      // Generate fresh quote
      const quote = await generateQuote('sell', undefined, usdcAmount);

      // Execute
      const result = await executeOrder(userId, 'sell', quote.brlAmount, usdcAmount, quote.effectiveRate);

      return {
        success: true,
        orderId: result.orderId,
        usdcAmount,
        brlAmount: quote.brlAmount,
        effectiveRate: quote.effectiveRate,
        spread: quote.spread,
        fee: result.fee,
        status: result.status,
      };
    } catch (error: any) {
      fastify.log.error('Error redeeming USDC: ' + (error instanceof Error ? error.message : String(error)));
      return reply.code(500).send({ error: error.message || 'Erro no resgate' });
    }
  });

  // =========================================================================
  // GET /api/dollar/transactions — histórico
  // =========================================================================
  fastify.get('/transactions', async (request: FastifyRequest, reply) => {
    try {
      const userId = getUserId(request);
      const { limit = '20', offset = '0' } = request.query as any;
      const transactions = await getTransactionHistory(userId, parseInt(limit), parseInt(offset));
      return { transactions };
    } catch (error: any) {
      fastify.log.error('Error fetching transactions: ' + (error instanceof Error ? error.message : String(error)));
      return reply.code(500).send({ error: 'Erro ao carregar histórico' });
    }
  });

  // =========================================================================
  // GET /api/dollar/yield — rendimentos
  // =========================================================================
  fastify.get('/yield', async (request, reply) => {
    try {
      const userId = getUserId(request);
      const yields = await getYieldHistory(userId);
      const account = await getDollarAccount(userId);
      return {
        yields,
        total_accumulated: parseFloat(account.accumulated_yield || '0'),
        yield_enabled: account.yield_enabled,
        current_rate: 10.0, // 10% a.a. via MB
      };
    } catch (error: any) {
      fastify.log.error('Error fetching yields: ' + (error instanceof Error ? error.message : String(error)));
      return reply.code(500).send({ error: 'Erro ao carregar rendimentos' });
    }
  });

  // =========================================================================
  // GET /api/dollar/ticker — cotação pública (sem spread, pra display)
  // =========================================================================
  fastify.get('/ticker', async (request, reply) => {
    try {
      const ticker = await getUSDCTicker();
      return {
        pair: ticker.pair,
        buy: parseFloat(ticker.buy),
        sell: parseFloat(ticker.sell),
        last: parseFloat(ticker.last),
        high: parseFloat(ticker.high),
        low: parseFloat(ticker.low),
        vol: parseFloat(ticker.vol),
        change: ((parseFloat(ticker.last) - parseFloat(ticker.open)) / parseFloat(ticker.open) * 100).toFixed(2),
        timestamp: ticker.date,
      };
    } catch (error: any) {
      fastify.log.error('Error fetching ticker: ' + (error instanceof Error ? error.message : String(error)));
      return reply.code(500).send({ error: 'Erro ao carregar cotação' });
    }
  });
}
