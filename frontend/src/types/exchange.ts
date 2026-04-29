export type ExchangeProvider = 'foxbit' | 'binance' | 'coinbase' | 'bybit' | 'kraken';

export type ExchangeStatus =
  | 'connected'
  | 'pending'
  | 'needs_reauth'
  | 'failed'
  | 'revoked';

export type OrderSide = 'buy' | 'sell';

export type OrderType =
  | 'market'
  | 'limit'
  | 'stoplimit'
  | 'stopmarket'
  | 'instant';

export type PlaceOrderType =
  | 'MARKET'
  | 'LIMIT'
  | 'INSTANT'
  | 'STOP_LIMIT'
  | 'STOP_MARKET';

export type PlaceOrderSide = 'BUY' | 'SELL';

export interface ExchangeConnection {
  id: string;
  provider: ExchangeProvider;
  auth_method?: string;
  label: string | null;
  status: ExchangeStatus;
  last_sync_at: string | null;
  last_sync_status: string | null;
  last_error: string | null;
  total_brl_value_cents: number;
  created_at: string;
  updated_at?: string;
}

export interface ExchangeBalance {
  symbol: string;
  available: string;
  on_hold: string;
  total: string;
  brl_price: string | null;
  brl_value_cents: number;
  last_synced_at: string;
}

export interface ExchangePosition {
  symbol: string;
  qty: string;
  avg_price: string | null;
  cost: string | null;
  current_price: string | null;
  market_value_cents: number | null;
  pnl_cents: number | null;
  pnl_percent: string | null;
  last_synced_at: string;
}

export interface ExchangeOrder {
  id: string;
  external_order_id: string;
  client_order_id: string | null;
  instrument: string;
  side: OrderSide;
  order_type: OrderType;
  status: string;
  qty: string | null;
  qty_executed: string | null;
  price: string | null;
  price_avg: string | null;
  amount: string | null;
  funds_received: string | null;
  fee: string | null;
  remark: string | null;
  external_created_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConnectFoxbitInput {
  apiKey: string;
  apiSecret: string;
  label?: string;
}

export interface PlaceOrderInput {
  marketSymbol: string;
  side: PlaceOrderSide;
  type: PlaceOrderType;
  quantity?: string;
  amount?: string;
  price?: string;
  stopPrice?: string;
  postOnly?: boolean;
  clientOrderId?: string;
  timeInForce?: 'GTC' | 'FOK' | 'IOC';
  remark?: string;
}

export interface PlaceOrderResponse {
  order: {
    id?: number | string;
    sn?: string;
    clientOrderId?: string;
  };
}

export interface SyncResponse {
  ok: boolean;
}

export const ACTIVE_ORDER_STATES = new Set([
  'ACTIVE',
  'PARTIALLY_FILLED',
  'PENDING_CANCEL',
]);

export function isOrderCancelable(status: string): boolean {
  return ACTIVE_ORDER_STATES.has(status?.toUpperCase());
}
