import { useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { exchangesApi } from '@/lib/api-exchanges';
import { FoxbitWordmark } from './FoxbitWordmark';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected?: () => void;
}

export function ConnectFoxbitDialog({ open, onOpenChange, onConnected }: Props) {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [label, setLabel] = useState('Foxbit pessoal');
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setApiKey('');
    setApiSecret('');
    setLabel('Foxbit pessoal');
    setSubmitting(false);
  }

  async function handleSubmit() {
    if (!apiKey.trim() || !apiSecret.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Informe API Key e API Secret.',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    try {
      await exchangesApi.connectFoxbit({
        apiKey: apiKey.trim(),
        apiSecret: apiSecret.trim(),
        label: label.trim() || undefined,
      });
      toast({
        title: 'Foxbit conectada',
        description: 'Sincronização inicial será executada automaticamente.',
        variant: 'success',
      });
      reset();
      onOpenChange(false);
      onConnected?.();
    } catch (err: any) {
      toast({
        title: 'Falha ao conectar',
        description:
          err?.error || err?.detail || err?.message || 'Verifique as credenciais e tente novamente.',
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
        if (!submitting) onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Conectar <FoxbitWordmark />
          </DialogTitle>
          <DialogDescription>
            As credenciais ficam criptografadas (AES-256-GCM) e usadas apenas para sincronizar saldos
            e operar. Permissões mínimas recomendadas: <strong>Leitura</strong> + <strong>Trade</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="foxbit-api-key">API Key</Label>
            <Input
              id="foxbit-api-key"
              type="text"
              autoComplete="off"
              placeholder="abcd1234..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foxbit-api-secret">API Secret</Label>
            <Input
              id="foxbit-api-secret"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foxbit-label">Identificação (opcional)</Label>
            <Input
              id="foxbit-label"
              type="text"
              placeholder="Foxbit pessoal"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={submitting}
            />
          </div>

          <a
            href="https://docs.foxbit.com.br/rest/v3/#tag/Authentication"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Como gerar uma API Key na Foxbit
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Conectar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
