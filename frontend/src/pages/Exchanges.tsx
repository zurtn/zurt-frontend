import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bitcoin, Plus, Wallet, TrendingUp, ListOrdered, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { exchangesApi } from '@/lib/api-exchanges';
import type {
  ExchangeBalance,
  ExchangeConnection,
  ExchangeOrder,
  ExchangePosition,
} from '@/types/exchange';
import { ConnectFoxbitDialog } from '@/components/exchanges/ConnectFoxbitDialog';
import { ExchangeCard } from '@/components/exchanges/ExchangeCard';
import { BalancesTable } from '@/components/exchanges/BalancesTable';
import { PositionsTable } from '@/components/exchanges/PositionsTable';
import { OrdersTable } from '@/components/exchanges/OrdersTable';
import { PlaceOrderDialog } from '@/components/exchanges/PlaceOrderDialog';

export default function Exchanges() {
  const { toast } = useToast();
  const [connections, setConnections] = useState<ExchangeConnection[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [connectFoxbitOpen, setConnectFoxbitOpen] = useState(false);
  const [placeOrderOpen, setPlaceOrderOpen] = useState(false);

  const [balances, setBalances] = useState<ExchangeBalance[]>([]);
  const [positions, setPositions] = useState<ExchangePosition[]>([]);
  const [orders, setOrders] = useState<ExchangeOrder[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const selected = useMemo(
    () => connections.find((c) => c.id === selectedId) ?? null,
    [connections, selectedId]
  );

  const loadList = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await exchangesApi.list();
      setConnections(res.connections ?? []);
      if (res.connections?.length) {
        setSelectedId((curr) => curr ?? res.connections[0].id);
      } else {
        setSelectedId(null);
      }
    } catch (err: any) {
      toast({
        title: 'Falha ao carregar exchanges',
        description: err?.error || err?.detail || err?.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingList(false);
    }
  }, [toast]);

  const loadDetail = useCallback(
    async (connectionId: string) => {
      setLoadingDetail(true);
      try {
        const [b, p, o] = await Promise.all([
          exchangesApi.getBalances(connectionId),
          exchangesApi.getPositions(connectionId),
          exchangesApi.getOrders(connectionId, { limit: 200 }),
        ]);
        setBalances(b.balances ?? []);
        setPositions(p.positions ?? []);
        setOrders(o.orders ?? []);
      } catch (err: any) {
        toast({
          title: 'Falha ao carregar detalhes',
          description: err?.error || err?.detail || err?.message,
          variant: 'destructive',
        });
      } finally {
        setLoadingDetail(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (selectedId) {
      loadDetail(selectedId);
    } else {
      setBalances([]);
      setPositions([]);
      setOrders([]);
    }
  }, [selectedId, loadDetail]);

  const handleChanged = useCallback(async () => {
    await loadList();
    if (selectedId) await loadDetail(selectedId);
  }, [loadList, loadDetail, selectedId]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Bitcoin className="h-6 w-6 text-primary" />
            Crypto
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Conecte sua corretora cripto e acompanhe saldos, posições e ordens em um só lugar.
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Conectar Exchange
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Disponíveis</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => setConnectFoxbitOpen(true)}>
              Foxbit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground">Em breve</DropdownMenuLabel>
            <DropdownMenuItem disabled>Binance</DropdownMenuItem>
            <DropdownMenuItem disabled>Coinbase</DropdownMenuItem>
            <DropdownMenuItem disabled>Bybit</DropdownMenuItem>
            <DropdownMenuItem disabled>Kraken</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {loadingList ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando exchanges...
        </div>
      ) : connections.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card/30 p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Bitcoin className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-lg font-medium">Nenhuma exchange conectada</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Conecte sua conta Foxbit para sincronizar saldos cripto, ver posições consolidadas e
            operar diretamente da ZURT.
          </p>
          <Button className="mt-6" onClick={() => setConnectFoxbitOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Conectar Foxbit
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((c) => (
              <ExchangeCard
                key={c.id}
                connection={c}
                selected={selectedId === c.id}
                onSelect={() => setSelectedId(c.id)}
                onChanged={handleChanged}
              />
            ))}
          </div>

          {selected && (
            <section className="rounded-lg border bg-card/30 p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">
                  Detalhe — {selected.label || selected.provider.toUpperCase()}
                </h2>
                <Button onClick={() => setPlaceOrderOpen(true)}>
                  <Zap className="mr-2 h-4 w-4" />
                  Operar
                </Button>
              </div>

              <Tabs defaultValue="balances" className="w-full">
                <TabsList>
                  <TabsTrigger value="balances">
                    <Wallet className="mr-2 h-3.5 w-3.5" />
                    Saldos
                  </TabsTrigger>
                  <TabsTrigger value="positions">
                    <TrendingUp className="mr-2 h-3.5 w-3.5" />
                    Posições
                  </TabsTrigger>
                  <TabsTrigger value="orders">
                    <ListOrdered className="mr-2 h-3.5 w-3.5" />
                    Ordens
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="balances" className="mt-4">
                  <BalancesTable balances={balances} loading={loadingDetail} />
                </TabsContent>
                <TabsContent value="positions" className="mt-4">
                  <PositionsTable positions={positions} loading={loadingDetail} />
                </TabsContent>
                <TabsContent value="orders" className="mt-4">
                  <OrdersTable
                    connectionId={selected.id}
                    orders={orders}
                    loading={loadingDetail}
                    onChanged={handleChanged}
                  />
                </TabsContent>
              </Tabs>
            </section>
          )}
        </>
      )}

      <ConnectFoxbitDialog
        open={connectFoxbitOpen}
        onOpenChange={setConnectFoxbitOpen}
        onConnected={handleChanged}
      />

      {selected && (
        <PlaceOrderDialog
          open={placeOrderOpen}
          onOpenChange={setPlaceOrderOpen}
          connectionId={selected.id}
          onSuccess={handleChanged}
        />
      )}
    </div>
  );
}
