import { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { exchangesApi } from '@/lib/api-exchanges';
import type { ExchangeConnection, ExchangeStatus } from '@/types/exchange';
import { FoxbitWordmark } from './FoxbitWordmark';

interface Props {
  connection: ExchangeConnection;
  selected?: boolean;
  onSelect?: () => void;
  onChanged?: () => void;
}

const STATUS_LABELS: Record<ExchangeStatus, string> = {
  connected: 'Conectada',
  pending: 'Pendente',
  needs_reauth: 'Reconectar',
  failed: 'Falha',
  revoked: 'Revogada',
};

function statusVariant(s: ExchangeStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (s === 'connected') return 'default';
  if (s === 'pending') return 'secondary';
  return 'destructive';
}

function StatusIcon({ status }: { status: ExchangeStatus }) {
  if (status === 'connected') return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (status === 'pending') return <Clock className="h-3.5 w-3.5" />;
  return <AlertCircle className="h-3.5 w-3.5" />;
}

function formatBrlCents(cents: number | null | undefined): string {
  const amount = (cents ?? 0) / 100;
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

function formatRelative(iso: string | null): string {
  if (!iso) return 'Nunca sincronizado';
  const then = new Date(iso).getTime();
  const now = Date.now();
  const seconds = Math.max(0, Math.round((now - then) / 1000));
  if (seconds < 60) return 'há instantes';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.round(hours / 24);
  return `há ${days}d`;
}

export function ExchangeCard({ connection, selected, onSelect, onChanged }: Props) {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleSync(e: React.MouseEvent) {
    e.stopPropagation();
    setSyncing(true);
    try {
      await exchangesApi.sync(connection.id);
      toast({ title: 'Sincronizado', variant: 'success' });
      onChanged?.();
    } catch (err: any) {
      toast({
        title: 'Falha ao sincronizar',
        description: err?.error || err?.detail || err?.message,
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  }

  async function handleRemove() {
    setRemoving(true);
    try {
      await exchangesApi.remove(connection.id);
      toast({ title: 'Conexão removida', variant: 'success' });
      setConfirmOpen(false);
      onChanged?.();
    } catch (err: any) {
      toast({
        title: 'Falha ao remover',
        description: err?.error || err?.detail || err?.message,
        variant: 'destructive',
      });
    } finally {
      setRemoving(false);
    }
  }

  return (
    <>
      <Card
        className={`cursor-pointer transition-all hover:border-primary/40 ${
          selected ? 'border-primary ring-1 ring-primary/30' : ''
        }`}
        onClick={onSelect}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              {connection.provider === 'foxbit' ? (
                <FoxbitWordmark className="text-base" />
              ) : (
                <span className="font-mono uppercase">{connection.provider}</span>
              )}
            </CardTitle>
            {connection.label && (
              <p className="text-xs text-muted-foreground">{connection.label}</p>
            )}
          </div>
          <Badge variant={statusVariant(connection.status)} className="gap-1">
            <StatusIcon status={connection.status} />
            {STATUS_LABELS[connection.status]}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Patrimônio</p>
            <p className="text-2xl font-semibold tabular-nums">
              {formatBrlCents(connection.total_brl_value_cents)}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Última sync: {formatRelative(connection.last_sync_at)}</span>
          </div>
          {connection.last_error && connection.last_sync_status === 'error' && (
            <p className="text-xs text-destructive line-clamp-2" title={connection.last_error}>
              {connection.last_error}
            </p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={syncing}
              className="flex-1"
            >
              {syncing ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
              )}
              Sincronizar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              disabled={removing}
              aria-label="Remover conexão"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={(v) => !removing && setConfirmOpen(v)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover conexão?</AlertDialogTitle>
            <AlertDialogDescription>
              Os saldos, posições e ordens cacheados serão apagados. Você pode reconectar a qualquer
              momento informando suas chaves de API novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRemove();
              }}
              disabled={removing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removing && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
