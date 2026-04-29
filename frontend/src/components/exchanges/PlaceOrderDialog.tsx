import { useMemo, useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { exchangesApi } from '@/lib/api-exchanges';
import type { PlaceOrderInput, PlaceOrderSide, PlaceOrderType } from '@/types/exchange';

// TODO: replace with backend endpoint GET /api/exchanges/markets/foxbit
// (public, cached, served by MarketDataApi.listMarkets()).
const HARDCODED_MARKETS = ['btcbrl', 'ethbrl', 'solbrl', 'usdtbrl'] as const;

const ORDER_TYPES: { value: PlaceOrderType; label: string; help: string }[] = [
  { value: 'MARKET', label: 'Mercado', help: 'Compra/venda imediata pela melhor oferta' },
  { value: 'LIMIT', label: 'Limite', help: 'Define um preço alvo (maker/taker)' },
  { value: 'INSTANT', label: 'Instant', help: 'Compra/venda por valor em moeda quote (R$)' },
  { value: 'STOP_LIMIT', label: 'Stop Limit', help: 'Dispara ordem limite ao atingir o stop' },
  { value: 'STOP_MARKET', label: 'Stop Mercado', help: 'Dispara ordem mercado ao atingir o stop' },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  defaultMarket?: string;
  onSuccess?: () => void;
}

export function PlaceOrderDialog({
  open,
  onOpenChange,
  connectionId,
  defaultMarket = HARDCODED_MARKETS[0],
  onSuccess,
}: Props) {
  const { toast } = useToast();
  const [type, setType] = useState<PlaceOrderType>('MARKET');
  const [side, setSide] = useState<PlaceOrderSide>('BUY');
  const [market, setMarket] = useState<string>(defaultMarket);
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [postOnly, setPostOnly] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const requiresQuantity = type !== 'INSTANT';
  const requiresAmount = type === 'INSTANT';
  const requiresPrice = type === 'LIMIT' || type === 'STOP_LIMIT';
  const requiresStop = type === 'STOP_LIMIT' || type === 'STOP_MARKET';
  const allowPostOnly = type === 'LIMIT';

  const estCost = useMemo(() => {
    if (requiresAmount && amount) return Number(amount);
    if (requiresQuantity && requiresPrice && quantity && price) {
      return Number(quantity) * Number(price);
    }
    return null;
  }, [requiresAmount, amount, requiresQuantity, requiresPrice, quantity, price]);

  function reset() {
    setQuantity('');
    setAmount('');
    setPrice('');
    setStopPrice('');
    setPostOnly(false);
    setConfirming(false);
    setSubmitting(false);
  }

  function validate(): string | null {
    if (!market) return 'Selecione um mercado';
    if (requiresQuantity && (!quantity || Number(quantity) <= 0)) return 'Informe uma quantidade válida';
    if (requiresAmount && (!amount || Number(amount) <= 0)) return 'Informe um valor válido';
    if (requiresPrice && (!price || Number(price) <= 0)) return 'Informe um preço válido';
    if (requiresStop && (!stopPrice || Number(stopPrice) <= 0)) return 'Informe um stop price válido';
    return null;
  }

  function handleReview() {
    const err = validate();
    if (err) {
      toast({ title: 'Verifique os campos', description: err, variant: 'destructive' });
      return;
    }
    setConfirming(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const input: PlaceOrderInput = {
        marketSymbol: market,
        side,
        type,
        ...(requiresQuantity ? { quantity } : {}),
        ...(requiresAmount ? { amount } : {}),
        ...(requiresPrice ? { price } : {}),
        ...(requiresStop ? { stopPrice } : {}),
        ...(allowPostOnly && postOnly ? { postOnly } : {}),
      };
      const res = await exchangesApi.placeOrder(connectionId, input);
      toast({
        title: 'Ordem enviada',
        description: res?.order?.id ? `ID Foxbit: ${res.order.id}` : 'Ordem aceita pela Foxbit.',
        variant: 'success',
      });
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast({
        title: 'Falha ao enviar ordem',
        description: err?.error || err?.detail || err?.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!submitting) {
          onOpenChange(v);
          if (!v) reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Operar na Foxbit</DialogTitle>
          <DialogDescription>
            Operação real com saldo da exchange. Confirme tudo antes de enviar.
          </DialogDescription>
        </DialogHeader>

        {!confirming ? (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={type} onValueChange={(v) => setType(v as PlaceOrderType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">
                  {ORDER_TYPES.find((t) => t.value === type)?.help}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Lado</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={side === 'BUY' ? 'default' : 'outline'}
                    onClick={() => setSide('BUY')}
                    className={side === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  >
                    Comprar
                  </Button>
                  <Button
                    type="button"
                    variant={side === 'SELL' ? 'default' : 'outline'}
                    onClick={() => setSide('SELL')}
                    className={side === 'SELL' ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    Vender
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mercado</Label>
              <Select value={market} onValueChange={setMarket}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HARDCODED_MARKETS.map((m) => (
                    <SelectItem key={m} value={m} className="font-mono">
                      {m.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {requiresQuantity && (
              <div className="space-y-2">
                <Label htmlFor="po-qty">Quantidade</Label>
                <Input
                  id="po-qty"
                  type="number"
                  inputMode="decimal"
                  step="0.00000001"
                  placeholder="0.00000000"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            )}

            {requiresAmount && (
              <div className="space-y-2">
                <Label htmlFor="po-amount">Valor (R$)</Label>
                <Input
                  id="po-amount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            )}

            {requiresPrice && (
              <div className="space-y-2">
                <Label htmlFor="po-price">Preço (R$)</Label>
                <Input
                  id="po-price"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}

            {requiresStop && (
              <div className="space-y-2">
                <Label htmlFor="po-stop">Stop Price (R$)</Label>
                <Input
                  id="po-stop"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="0.00"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                />
              </div>
            )}

            {allowPostOnly && (
              <div className="flex items-center gap-2">
                <Switch id="po-postonly" checked={postOnly} onCheckedChange={setPostOnly} />
                <Label htmlFor="po-postonly" className="text-xs cursor-pointer">
                  Post Only (somente maker)
                </Label>
              </div>
            )}

            {estCost !== null && (
              <div className="rounded-md border bg-muted/30 p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor estimado</span>
                  <span className="font-medium tabular-nums">
                    {estCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Não inclui taxas. Taxa final depende da Foxbit (maker/taker).
                </p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleReview} className={side === 'SELL' ? 'bg-red-600 hover:bg-red-700' : ''}>
                Revisar ordem
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3 flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Esta é uma operação real, com saldo da sua conta Foxbit. Não há desfazer.
              </p>
            </div>

            <dl className="text-sm space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tipo</dt>
                <dd className="font-medium">
                  {ORDER_TYPES.find((t) => t.value === type)?.label} ·{' '}
                  {side === 'BUY' ? 'Compra' : 'Venda'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Mercado</dt>
                <dd className="font-mono">{market.toUpperCase()}</dd>
              </div>
              {requiresQuantity && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Quantidade</dt>
                  <dd className="font-mono tabular-nums">{quantity}</dd>
                </div>
              )}
              {requiresAmount && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Valor (R$)</dt>
                  <dd className="font-mono tabular-nums">{amount}</dd>
                </div>
              )}
              {requiresPrice && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Preço (R$)</dt>
                  <dd className="font-mono tabular-nums">{price}</dd>
                </div>
              )}
              {requiresStop && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Stop (R$)</dt>
                  <dd className="font-mono tabular-nums">{stopPrice}</dd>
                </div>
              )}
              {allowPostOnly && postOnly && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Post Only</dt>
                  <dd>Sim</dd>
                </div>
              )}
            </dl>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirming(false)}
                disabled={submitting}
              >
                Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className={side === 'SELL' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar e enviar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
