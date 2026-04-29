import { api } from './api-client';
import type {
  ConnectFoxbitInput,
  ExchangeBalance,
  ExchangeConnection,
  ExchangeOrder,
  ExchangePosition,
  PlaceOrderInput,
  PlaceOrderResponse,
  SyncResponse,
} from '@/types/exchange';

export const exchangesApi = {
  list: () =>
    api.get<{ connections: ExchangeConnection[] }>('/exchanges'),

  connectFoxbit: (input: ConnectFoxbitInput) =>
    api.post<{ connection: ExchangeConnection }>('/exchanges/foxbit/connect', input),

  getBalances: (connectionId: string) =>
    api.get<{ balances: ExchangeBalance[] }>(`/exchanges/${connectionId}/balances`),

  getPositions: (connectionId: string) =>
    api.get<{ positions: ExchangePosition[] }>(`/exchanges/${connectionId}/positions`),

  getOrders: (
    connectionId: string,
    filters: { instrument?: string; status?: string; limit?: number } = {}
  ) => {
    const qs = new URLSearchParams();
    if (filters.instrument) qs.set('instrument', filters.instrument);
    if (filters.status) qs.set('status', filters.status);
    if (filters.limit !== undefined) qs.set('limit', String(filters.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return api.get<{ orders: ExchangeOrder[] }>(`/exchanges/${connectionId}/orders${suffix}`);
  },

  sync: (connectionId: string) =>
    api.post<SyncResponse>(`/exchanges/${connectionId}/sync`),

  placeOrder: (connectionId: string, input: PlaceOrderInput) =>
    api.post<PlaceOrderResponse>(`/exchanges/${connectionId}/orders`, input),

  cancelOrder: (connectionId: string, orderId: string) =>
    api.delete<{ ok: boolean }>(`/exchanges/${connectionId}/orders/${orderId}`),

  remove: (connectionId: string) =>
    api.delete<{ ok: boolean }>(`/exchanges/${connectionId}`),
};
