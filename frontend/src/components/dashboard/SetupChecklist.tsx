import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, X } from "lucide-react";
import { activationApi } from "@/lib/api-activation";
import { cn } from "@/lib/utils";

/**
 * Post-onboarding setup checklist (dashboard card).
 *
 * Re-engages users who skipped connections during activation. Fully derived
 * from /api/activation -- disappears on its own once everything is connected,
 * or when the user dismisses it (localStorage).
 */

const DISMISS_KEY = "zurt_setup_checklist_dismissed";

const SetupChecklist = () => {
  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(DISMISS_KEY) === "1"
  );
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const { data: status, refetch } = useQuery({
    queryKey: ["activation", "status"],
    queryFn: () => activationApi.getStatus(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  if (dismissed || !status) return null;

  const ofDone = status.connections.open_finance.connected;
  const b3Available = status.features.b3_connect === "available";
  const b3Done = status.connections.b3.status === "active" || status.b3_interest || joined;

  const items: {
    id: string;
    done: boolean;
    title: string;
    desc: string;
    to?: string;
    action?: () => Promise<void>;
  }[] = [
    {
      id: "of",
      done: ofDone,
      title: "Conectar Open Finance",
      desc: "Bancos, cartões e transações direto no painel",
      to: "/app/connections/open-finance",
    },
    {
      id: "b3",
      done: b3Done,
      title: b3Available ? "Conectar B3" : "B3 — lista de espera",
      desc: b3Available
        ? "Importe ações, FIIs e Tesouro automaticamente"
        : "Contrato assinado — garanta a ativação automática",
      to: b3Available ? "/app/connections/b3" : undefined,
      action: b3Available
        ? undefined
        : async () => {
            setJoining(true);
            try {
              await activationApi.registerB3Interest();
              setJoined(true);
              refetch();
            } finally {
              setJoining(false);
            }
          },
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  if (doneCount === items.length) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 relative">
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-3 right-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        aria-label="Dispensar checklist"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center justify-between gap-4 mb-4 pr-8">
        <div>
          <h3 className="font-semibold text-foreground">Complete seu setup</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Conecte suas fontes de dados para liberar análises completas e insights
            automáticos do portfólio.
          </p>
        </div>
        <span className="text-xs font-medium text-primary tabular-nums shrink-0">
          {doneCount}/{items.length}
        </span>
      </div>

      <div className="h-1 rounded-full bg-muted mb-4 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(doneCount / items.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((it) => {
          const inner = (
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-md border transition-colors",
                it.done
                  ? "border-border/50 bg-muted/30"
                  : "border-border hover:border-primary/40 bg-background/40"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                  it.done ? "bg-primary border-primary" : "border-muted-foreground/30"
                )}
              >
                {it.done && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className={cn("text-sm font-medium", it.done ? "text-muted-foreground" : "text-foreground")}>
                  {it.title}
                </div>
                {!it.done && <div className="text-xs text-muted-foreground truncate">{it.desc}</div>}
              </div>
              {!it.done && <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            </div>
          );

          if (it.done) return <div key={it.id}>{inner}</div>;
          if (it.to)
            return (
              <Link key={it.id} to={it.to} className="block">
                {inner}
              </Link>
            );
          return (
            <button
              key={it.id}
              type="button"
              disabled={joining}
              onClick={it.action}
              className="block w-full text-left disabled:opacity-60"
            >
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SetupChecklist;
