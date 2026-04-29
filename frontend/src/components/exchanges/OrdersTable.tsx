import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { exchangesApi } from '@/lib/api-exchanges';
import { isOrderCancelable, type ExchangeOrder } from '@/types/exchange';

const PAGE_SIZE = 50;

function formatDateTime(iso: string | null): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatNumber(v: string | null | undefined, max = 8): string {
  const n = Number(v ?? 0);
  if (!Number.isFinite(n) || n === 0) return '-';
  return n.toLocaleString('pt-BR', { maximumFractionDigits: max });
}

function formatBrl(v: string | null | undefined): string {
  const n = Number(v ?? 0);
  if (!Number.isFinite(n) || n === 0) return '-';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function orderTypeLabel(t: string): string {
  return (
    {
      market: 'Mercado',
      limit: 'Limite',
      stoplimit: 'Stop Limit',
      stopmarket: 'Stop Mercado',
      instant: 'Instant',
    }[t] || t
  );
}

interface Props {
  connectionId: string;
  orders: ExchangeOrder[];
  loading?: boolean;
  onChanged?: () => void;
}

export function OrdersTable({ connectionId, orders, loading, onChanged }: Props) {
  const { toast } = useToast();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  async function handleCancel(externalOrderId: string) {
    setCancelingId(externalOrderId);
    try {
      await exchangesApi.cancelOrder(connectionId, externalOrderId);
      toast({ title: 'Cancelamento solicitado', variant: 'success' });
      onChanged?.();
    } catch (err: any) {
      toast({
        title: 'Falha ao cancelar',
        description: err?.error || err?.detail || err?.message,
        variant: 'destructive',
      });
    } finally {
      setCancelingId(null);
    }
  }

  const rows = orders.slice(0, visible);
  const hasMore = orders.length > visible;

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Mercado</TableHead>
              <TableHead>Lado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Carregando ordens...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhuma ordem encontrada.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((o) => {
                const cancelable = isOrderCancelable(o.status);
                return (
                  <TableRow key={o.id}>
                    <TableCell className="text-xs whitespace-nowrap">
                      {formatDateTime(o.external_created_at)}
                    </TableCell>
                    <TableCell className="font-mono text-xs uppercase">{o.instrument}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          o.side === 'buy'
                            ? 'border-emerald-500/30 text-emerald-500'
                            : 'border-red-500/30 text-red-500'
                        }
                      >
                        {o.side === 'buy' ? 'Compra' : 'Venda'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{orderTypeLabel(o.order_type)}</TableCell>
                    <TableCell className="text-right tabular-nums text-xs">
                      {formatNumber(o.qty)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-xs">
                      {formatBrl(o.price ?? o.price_avg)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {cancelable ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCancel(o.external_order_id)}
                          disabled={cancelingId === o.external_order_id}
                        >
                          {cancelingId === o.external_order_id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Carregar mais ({orders.length - visible} restantes)
          </Button>
        </div>
      )}
    </div>
  );
}
