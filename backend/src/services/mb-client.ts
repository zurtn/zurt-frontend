import { db } from '../db/connection.js';

// ===========================================================================
// Mercado Bitcoin API Client — USDC/BRL Operations
// ===========================================================================

const MB_API = 'https://api.mercadobitcoin.net/api/v4';
const SPREAD_PCT = 0.0075; // 0.75% spread ZURT
const QUOTE_TTL_MS = 30_000; // Cotação válida por 30 segundos

interface MBTicker {
  pair: string;
  high: string;
  low: string;
  vol: string;
  last: string;
  buy: string;
  sell: string;
  open: string;
  date: number;
}

interface MBQuote {
  marketRate: number;
  spread: number;
  effectiveRate: number;
  usdcAmount: number;
  brlAmount: number;
  expiresAt: number;
  type: 'buy' | 'sell';
}

interface MBOrderResult {
  orderId: string;
  status: string;
  avgPrice: number;
  filledQty: string;
  fee: string;
}

// ---------------------------------------------------------------------------
// Public endpoints (no auth needed)
// ---------------------------------------------------------------------------

export async function getUSDCTicker(): Promise<MBTicker> {
  const res = await fetch(`${MB_API}/tickers?symbols=USDC-BRL`);
  if (!res.ok) throw new Error(`MB ticker error: ${res.status}`);
  const data = await res.json();
  return (Array.isArray(data) ? data[0] : data) as MBTicker;
}

export async function getUSDCOrderbook(limit = 5) {
  const res = await fetch(`${MB_API}/USDC-BRL/orderbook?limit=${limit}`);
  if (!res.ok) throw new Error(`MB orderbook error: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Quote generation (with ZURT spread)
// ---------------------------------------------------------------------------

export async function generateQuote(type: 'buy' | 'sell', brlAmount?: number, usdcAmount?: number): Promise<MBQuote> {
  const ticker = await getUSDCTicker();

  if (type === 'buy') {
    // BRL -> USDC (dolarizar)
    const marketRate = parseFloat(ticker.sell); // preço de venda no mercado
    const effectiveRate = marketRate * (1 + SPREAD_PCT);
    const amount = brlAmount || 0;
    const usdc = amount / effectiveRate;

    return {
      marketRate,
      spread: SPREAD_PCT,
      effectiveRate,
      usdcAmount: Math.floor(usdc * 100) / 100, // arredonda pra baixo
      brlAmount: amount,
      expiresAt: Date.now() + QUOTE_TTL_MS,
      type: 'buy',
    };
  } else {
    // USDC -> BRL (resgatar)
    const marketRate = parseFloat(ticker.buy); // preço de compra no mercado
    const effectiveRate = marketRate * (1 - SPREAD_PCT);
    const usdc = usdcAmount || 0;
    const brl = usdc * effectiveRate;

    return {
      marketRate,
      spread: SPREAD_PCT,
      effectiveRate,
      usdcAmount: usdc,
      brlAmount: Math.floor(brl * 100) / 100,
      expiresAt: Date.now() + QUOTE_TTL_MS,
      type: 'sell',
    };
  }
}

// ---------------------------------------------------------------------------
// Execute order (requires MB API key — mock for now until verification)
// ---------------------------------------------------------------------------

export async function executeOrder(
  userId: string,
  type: 'buy' | 'sell',
  brlAmount: number,
  usdcAmount: number,
  effectiveRate: number,
): Promise<MBOrderResult> {
  // TODO: Replace with real MB API call when API key is available
  // For now, simulate the execution and update balances
  
  const mockOrderId = `mb_sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Ensure dollar account exists
  await db.query(`
    INSERT INTO dollar_accounts (user_id) VALUES ($1)
    ON CONFLICT (user_id) DO NOTHING
  `, [userId]);

  if (type === 'buy') {
    // Dolarizar: usuario envia BRL, recebe USDC
    await db.query(`
      UPDATE dollar_accounts 
      SET usdc_balance = usdc_balance + $2, updated_at = NOW()
      WHERE user_id = $1
    `, [userId, usdcAmount]);
  } else {
    // Resgatar: usuario envia USDC, recebe BRL
    const account = await db.query(
      'SELECT usdc_balance FROM dollar_accounts WHERE user_id = $1',
      [userId]
    );
    if (!account.rows[0] || parseFloat(account.rows[0].usdc_balance) < usdcAmount) {
      throw new Error('Saldo USDC insuficiente');
    }
    await db.query(`
      UPDATE dollar_accounts 
      SET usdc_balance = usdc_balance - $2, updated_at = NOW()
      WHERE user_id = $1
    `, [userId, usdcAmount]);
  }

  // Record transaction
  await db.query(`
    INSERT INTO dollar_transactions 
    (user_id, type, brl_amount, usdc_amount, exchange_rate, spread_pct, effective_rate, mb_order_id, mb_status, status, completed_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'filled', 'completed', NOW())
  `, [userId, type, brlAmount, usdcAmount, effectiveRate / (1 + SPREAD_PCT), SPREAD_PCT, effectiveRate, mockOrderId]);

  return {
    orderId: mockOrderId,
    status: 'filled',
    avgPrice: effectiveRate,
    filledQty: usdcAmount.toString(),
    fee: (brlAmount * 0.003).toFixed(2), // MB fee estimate
  };
}

// ---------------------------------------------------------------------------
// Account helpers
// ---------------------------------------------------------------------------

export async function getDollarAccount(userId: string) {
  const result = await db.query(`
    SELECT da.*, 
      (SELECT COALESCE(SUM(amount), 0) FROM dollar_yields WHERE user_id = da.user_id) as total_yield,
      (SELECT COUNT(*) FROM dollar_transactions WHERE user_id = da.user_id AND status = 'completed') as total_transactions
    FROM dollar_accounts da
    WHERE da.user_id = $1
  `, [userId]);

  if (result.rows.length === 0) {
    return { usdc_balance: 0, yield_enabled: false, accumulated_yield: 0, total_yield: 0, total_transactions: 0 };
  }
  return result.rows[0];
}

export async function getTransactionHistory(userId: string, limit = 20, offset = 0) {
  const result = await db.query(`
    SELECT id, type, brl_amount, usdc_amount, exchange_rate, spread_pct, effective_rate,
           mb_order_id, status, created_at, completed_at
    FROM dollar_transactions
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `, [userId, limit, offset]);
  return result.rows;
}

export async function getYieldHistory(userId: string, limit = 30) {
  const result = await db.query(`
    SELECT id, amount, rate, balance_snapshot, date
    FROM dollar_yields
    WHERE user_id = $1
    ORDER BY date DESC
    LIMIT $2
  `, [userId, limit]);
  return result.rows;
}
