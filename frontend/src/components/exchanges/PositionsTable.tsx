import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ExchangePosition } from '@/types/exchange';

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

function formatBrlCents(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return '-';
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatPercent(v: string | null | undefined): string {
  if (v === null || v === undefined) return '-';
  const n = Number(v);
  if (!Number.isFinite(n)) return '-';
  return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
}

function pnlClass(pnl: number | null | undefined): string {
  if (pnl === null || pnl === undefined || pnl === 0) return 'text-muted-foreground';
  return pnl > 0 ? 'text-emerald-500' : 'text-red-500';
}

interface Props {
  positions: ExchangePosition[];
  loading?: boolean;
}

export function PositionsTable({ positions, loading }: Props) {
  const rows = useMemo(
    () =>
      [...positions].sort(
        (a, b) => (b.market_value_cents ?? 0) - (a.market_value_cents ?? 0)
      ),
    [positions]
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ativo</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead className="text-right">Preço Médio</TableHead>
            <TableHead className="text-right">Custo</TableHead>
            <TableHead className="text-right">Preço Atual</TableHead>
            <TableHead className="text-right">Valor de Mercado</TableHead>
            <TableHead className="text-right">P&amp;L</TableHead>
            <TableHead className="text-right">P&amp;L %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                Carregando posições...
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                Nenhuma posição encontrada.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((p) => (
              <TableRow key={p.symbol}>
                <TableCell className="font-mono font-medium">{p.symbol}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(p.qty)}</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {formatBrl(p.avg_price)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {formatBrl(p.cost)}
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatBrl(p.current_price)}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {formatBrlCents(p.market_value_cents)}
                </TableCell>
                <TableCell className={`text-right tabular-nums ${pnlClass(p.pnl_cents)}`}>
                  {formatBrlCents(p.pnl_cents)}
                </TableCell>
                <TableCell
                  className={`text-right tabular-nums ${pnlClass(
                    p.pnl_percent !== null && p.pnl_percent !== undefined
                      ? Number(p.pnl_percent)
                      : null
                  )}`}
                >
                  {formatPercent(p.pnl_percent)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
