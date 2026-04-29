import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { ExchangeBalance } from '@/types/exchange';

function formatNumber(v: string | null | undefined, max = 8): string {
  const n = Number(v ?? 0);
  if (!Number.isFinite(n)) return '-';
  return n.toLocaleString('pt-BR', { maximumFractionDigits: max });
}

function formatBrl(v: string | null | undefined): string {
  if (v === null || v === undefined) return '-';
  const n = Number(v);
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

interface Props {
  balances: ExchangeBalance[];
  loading?: boolean;
}

export function BalancesTable({ balances, loading }: Props) {
  const [hideZero, setHideZero] = useState(true);

  const rows = useMemo(() => {
    const filtered = hideZero ? balances.filter((b) => Number(b.total) > 0) : balances;
    return [...filtered].sort((a, b) => (b.brl_value_cents ?? 0) - (a.brl_value_cents ?? 0));
  }, [balances, hideZero]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <Switch
          id="hide-zero"
          checked={hideZero}
          onCheckedChange={setHideZero}
        />
        <Label htmlFor="hide-zero" className="text-xs text-muted-foreground cursor-pointer">
          Esconder saldos zerados
        </Label>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ativo</TableHead>
              <TableHead className="text-right">Disponível</TableHead>
              <TableHead className="text-right">Bloqueado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Preço (BRL)</TableHead>
              <TableHead className="text-right">Valor (BRL)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Carregando saldos...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {hideZero ? 'Nenhum saldo positivo encontrado.' : 'Nenhum saldo retornado.'}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((b) => (
                <TableRow key={b.symbol}>
                  <TableCell className="font-mono font-medium">{b.symbol}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(b.available)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(b.on_hold)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatNumber(b.total)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {formatBrl(b.brl_price)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatBrlCents(b.brl_value_cents)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
