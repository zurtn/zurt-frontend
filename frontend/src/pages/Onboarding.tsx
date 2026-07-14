import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { connectionsApi } from "@/lib/api-connections";
import {
  activationApi,
  type ActivationGoal,
  type ActivationStepId,
} from "@/lib/api-activation";

/**
 * Activation onboarding (first access) -- Cipher design system.
 *
 * Goal: shortest possible path from "new account" to "first connected data source".
 * Steps are dynamic: while the B3 API is not enabled (features.b3_connect =
 * "coming_soon"), Open Finance comes first and B3 becomes an early-access step.
 *
 * State lives in the backend (/api/activation). Connection status is derived
 * server-side from `connections` + `b3_consents`, so refreshing never loses progress.
 */

/* ------------------------------- Cipher tokens ------------------------------ */

const F = {
  display: "'Bebas Neue', sans-serif",
  mono: "'DM Mono', monospace",
};
const GREEN = "#00FF7A";

/* CPF helpers extraídos p/ @/lib/cpf (BUILD-CPF-IDENTIDADE T3 — reuso no registro) */
import { onlyDigits, formatCpf, isValidCpf, maskCpfFromLast3 } from "@/lib/cpf";

/* ------------------------------- Config & copy ------------------------------ */

const STEP_LABELS: Record<ActivationStepId, string> = {
  goal: "OBJETIVO",
  b3: "B3",
  open_finance: "OPEN FINANCE",
  done: "PRONTO",
};

const GOALS: { id: ActivationGoal; label: string; desc: string }[] = [
  {
    id: "consolidate",
    label: "CONSOLIDAR PATRIMÔNIO",
    desc: "Todos os bancos e corretoras em um único painel",
  },
  {
    id: "investments",
    label: "ACOMPANHAR INVESTIMENTOS",
    desc: "B3, fundos, cripto e renda fixa em tempo real",
  },
  {
    id: "organize",
    label: "ORGANIZAR FINANÇAS",
    desc: "Gastos, cartões e fluxo de caixa sob controle",
  },
  {
    id: "explore",
    label: "SÓ EXPLORANDO",
    desc: "Quero conhecer a plataforma antes de conectar",
  },
];

const GOAL_LABEL: Record<ActivationGoal, string> = {
  consolidate: "Consolidar patrimônio",
  investments: "Acompanhar investimentos",
  organize: "Organizar finanças",
  explore: "Explorando",
};

const OF_TRUST: { title: string; desc: string }[] = [
  { title: "SOMENTE LEITURA", desc: "A ZURT nunca movimenta o seu dinheiro" },
  { title: "AUTORIZAÇÃO NO BANCO", desc: "Você aprova direto no app da sua instituição" },
  { title: "REVOGÁVEL", desc: "Cancele o consentimento quando quiser" },
  { title: "LGPD", desc: "Dados criptografados, usados só nas suas análises" },
];

const B3_VALUE: { title: string; desc: string }[] = [
  { title: "POSIÇÃO CONSOLIDADA", desc: "Tudo que está no seu CPF na bolsa, importado automaticamente" },
  { title: "CUSTO MÉDIO E PROVENTOS", desc: "Base real para performance, dividendos e IR" },
  { title: "ZURT AGENT", desc: "Alertas de concentração e insights automáticos do portfólio" },
];

/* ----------------------------- Small UI pieces ------------------------------ */

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="mb-6 flex items-center gap-3 uppercase"
    style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: "0.2em", color: GREEN }}
  >
    <span style={{ width: 32, height: 1, background: GREEN, display: "inline-block" }} />
    {children}
  </div>
);

const H1 = ({ children }: { children: ReactNode }) => (
  <h1
    className="mb-5"
    style={{
      fontFamily: F.display,
      fontSize: "clamp(36px, 4.2vw, 56px)",
      lineHeight: 0.95,
      letterSpacing: "0.01em",
      color: "#fff",
      margin: 0,
    }}
  >
    {children}
  </h1>
);

const Sub = ({ children }: { children: ReactNode }) => (
  <p
    className="mt-5 mb-8"
    style={{
      fontFamily: F.mono,
      fontSize: 13,
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.45)",
      maxWidth: 520,
    }}
  >
    {children}
  </p>
);

const CTA = ({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full py-3.5 bg-[#00FF7A] text-black font-medium hover:opacity-85 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
    style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: "0.06em" }}
  >
    {children}
  </button>
);

const Ghost = ({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full py-3.5 border border-white/[0.1] text-white/60 hover:border-white/25 hover:text-white transition-colors disabled:opacity-50"
    style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: "0.06em" }}
  >
    {children}
  </button>
);

const InfoGrid = ({ items, cols = 2 }: { items: { title: string; desc: string }[]; cols?: 1 | 2 }) => (
  <div className={`grid gap-3 mb-8 ${cols === 2 ? "sm:grid-cols-2" : ""}`}>
    {items.map((it) => (
      <div key={it.title} className="p-4 border border-white/[0.06] bg-white/[0.02]">
        <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.12em", color: GREEN }}>
          {it.title}
        </div>
        <div
          className="mt-1.5"
          style={{ fontFamily: F.mono, fontSize: 11, lineHeight: 1.6, color: "rgba(255,255,255,0.4)" }}
        >
          {it.desc}
        </div>
      </div>
    ))}
  </div>
);

const RecapRow = ({ label, value, ok }: { label: string; value: string; ok: boolean }) => (
  <div className="flex items-center justify-between px-4 py-3.5">
    <span style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)" }}>
      {label}
    </span>
    <span
      className="flex items-center gap-2"
      style={{ fontFamily: F.mono, fontSize: 11, color: ok ? GREEN : "rgba(255,255,255,0.35)" }}
    >
      {ok && <Check className="h-3 w-3" />}
      {value}
    </span>
  </div>
);

/* ----------------------------------- Page ----------------------------------- */

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [b3Joined, setB3Joined] = useState(false);

  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth_token");

  useEffect(() => {
    if (!hasToken) navigate("/login", { replace: true });
  }, [hasToken, navigate]);

  const { data: status, isLoading, refetch } = useQuery({
    queryKey: ["activation", "status"],
    queryFn: () => activationApi.getStatus(),
    enabled: hasToken,
    refetchOnWindowFocus: false,
  });

  // Returning user who already finished activation: straight to the dashboard.
  // Only bounce from the very first screen -- never mid-flow.
  useEffect(() => {
    if (idx === 0 && status?.completed_at) navigate("/app/dashboard", { replace: true });
  }, [idx, status?.completed_at, navigate]);

  const b3Available = status?.features?.b3_connect === "available";
  const stepOrder = useMemo<ActivationStepId[]>(
    () => (b3Available ? ["goal", "b3", "open_finance", "done"] : ["goal", "open_finance", "b3", "done"]),
    [b3Available]
  );
  const current = stepOrder[idx];
  const firstName = (user?.full_name || "").trim().split(/\s+/)[0] || "";

  const ofCount = status?.connections?.open_finance?.count ?? 0;
  const b3Connected = status?.connections?.b3?.status === "active";
  const b3OnList = b3Joined || !!status?.b3_interest;

  const next = () => setIdx((i) => Math.min(i + 1, stepOrder.length - 1));

  /** Fire-and-forget step audit; refreshes derived status quietly. */
  const record = (step: ActivationStepId, action: "completed" | "skipped", goal?: ActivationGoal) =>
    activationApi
      .saveStep(step, action, goal)
      .then(() => refetch())
      .catch(() => {});

  const handleGoal = (g: ActivationGoal) => {
    record("goal", "completed", g);
    next();
  };

  const skipStep = (step: ActivationStepId) => {
    record(step, "skipped");
    next();
  };

  const skipAll = async () => {
    if (current !== "done") record(current, "skipped");
    try {
      await activationApi.complete();
    } catch {
      /* fail open -- never trap the user in the wizard */
    }
    queryClient.invalidateQueries({ queryKey: ["activation"] });
    navigate("/app/dashboard", { replace: true });
  };

  const finish = async () => {
    setBusy(true);
    record("done", "completed");
    try {
      await activationApi.complete();
    } catch {
      /* fail open */
    }
    queryClient.invalidateQueries({ queryKey: ["activation"] });
    navigate("/app/dashboard", { replace: true });
  };

  /* Pluggy Connect -- widget global carregado no index.html (cdn.pluggy.ai). */
  const openPluggy = async () => {
    if (!window.PluggyConnect) {
      toast({
        title: "Widget indisponível",
        description: "Não foi possível carregar o Open Finance. Recarregue a página e tente novamente.",
        variant: "destructive",
      });
      return;
    }

    setBusy(true);
    try {
      const { connectToken } = await connectionsApi.getConnectToken();
      const widget = new window.PluggyConnect({
        connectToken,
        onSuccess: async (itemData: { id: string }) => {
          try {
            await connectionsApi.create({ itemId: itemData.id });
            await refetch();
            toast({
              title: "Instituição conectada",
              description: "Sincronização iniciada — os dados aparecem no painel em instantes.",
            });
          } catch (e: any) {
            toast({
              title: "Erro ao salvar conexão",
              description: e?.error || "Tente novamente.",
              variant: "destructive",
            });
          } finally {
            setBusy(false);
          }
        },
        onError: () => {
          setBusy(false);
          toast({
            title: "Conexão não concluída",
            description: "Você pode tentar novamente quando quiser.",
            variant: "destructive",
          });
        },
        onClose: () => setBusy(false),
      });
      widget.init();

    } catch (e: any) {
      setBusy(false);
      toast({
        title: "Erro ao iniciar conexão",
        description: e?.error || "Tente novamente em instantes.",
        variant: "destructive",
      });
    }
  };

  const joinB3Waitlist = async () => {
    setBusy(true);
    try {
      await activationApi.registerB3Interest();
      setB3Joined(true);
      refetch();
    } catch {
      toast({
        title: "Não foi possível registrar",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  // BUILD-CPF-IDENTIDADE: conta COM CPF registrado conecta SEM digitar CPF —
  // o backend usa o CPF da conta (server-driven). Conta legada mantém o input
  // (o CPF digitado vira também a identidade da conta, travada dali em diante).
  const accountCpfMasked = maskCpfFromLast3(user?.cpf_last3);

  const submitB3Consent = async () => {
    const digits = onlyDigits(cpf);
    if (!accountCpfMasked && !isValidCpf(digits)) {
      setCpfError("CPF inválido — confira os dígitos.");
      return;
    }
    setBusy(true);
    setCpfError(null);
    try {
      await activationApi.b3Consent(accountCpfMasked ? undefined : digits);
      record("b3", "completed");
      await refetch();
      toast({ title: "B3 autorizada", description: "Suas posições serão importadas automaticamente." });
      next();
    } catch (e: any) {
      if (e?.code === "B3_CPF_IN_USE" || e?.code === "CPF_IN_USE") {
        setCpfError("Este CPF já está vinculado a outra conta ZURT. Se ele é seu, fale com o suporte.");
      } else if (e?.code === "B3_CPF_MISMATCH") {
        setCpfError("Este CPF não é o CPF do cadastro da sua conta. A B3 só pode ser conectada com o CPF do titular.");
      } else if (e?.code === "B3_CPF_INVALID") {
        setCpfError("CPF inválido — confira os dígitos.");
      } else {
        setCpfError(e?.error || "Falha ao autorizar. Tente novamente.");
      }
    } finally {
      setBusy(false);
    }
  };

  if (!hasToken) return null;

  if (isLoading && !status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: GREEN }} />
      </div>
    );
  }

  const progressPct = ((idx + 1) / stepOrder.length) * 100;

  return (
    <div className="min-h-screen flex bg-black">
      {/* ---------------------------- Left rail (lg+) --------------------------- */}
      <aside className="hidden lg:flex w-[340px] flex-col justify-between p-10 border-r border-white/[0.06] relative overflow-hidden">
        <div
          className="absolute -right-16 -bottom-20 select-none pointer-events-none"
          style={{ fontFamily: F.display, fontSize: 320, lineHeight: 1, color: "rgba(255,255,255,0.02)" }}
        >
          Z
        </div>

        <Link to="/" className="inline-block relative z-10">
          <span style={{ fontFamily: F.display, fontSize: 28, letterSpacing: "0.1em", color: "#fff" }}>
            ZURT
          </span>
        </Link>

        <div className="relative z-10 space-y-5">
          {stepOrder.map((s, i) => {
            const done = i < idx;
            const active = i === idx;
            const color = active ? "#fff" : done ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)";
            return (
              <div key={s} className="flex items-center gap-4">
                <span style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: "0.08em", color: active ? GREEN : color }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: F.display, fontSize: 20, letterSpacing: "0.06em", color }}>
                  {STEP_LABELS[s]}
                </span>
                {done && <Check className="h-3.5 w-3.5" style={{ color: GREEN }} />}
              </div>
            );
          })}
        </div>

        <div className="relative z-10 pt-8 border-t border-white/[0.06] space-y-2">
          {[
            "OPEN FINANCE · REGULADO PELO BANCO CENTRAL",
            "LGPD · DADOS CRIPTOGRAFADOS",
            "ACESSO SOMENTE LEITURA · REVOGÁVEL",
          ].map((t) => (
            <div key={t} style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: "0.1em", color: "rgba(255,255,255,0.28)" }}>
              {t}
            </div>
          ))}
        </div>
      </aside>

      {/* ------------------------------- Content -------------------------------- */}
      <main className="flex-1 flex flex-col" style={{ background: "#0a0a0a" }}>
        {/* Mobile progress bar */}
        <div className="lg:hidden h-0.5 w-full bg-white/[0.06]">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: GREEN }}
          />
        </div>

        <header className="flex items-center justify-between px-6 sm:px-10 py-6">
          <span className="lg:hidden" style={{ fontFamily: F.display, fontSize: 22, letterSpacing: "0.1em", color: "#fff" }}>
            ZURT
          </span>
          <span className="hidden lg:block" style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)" }}>
            PASSO {String(idx + 1).padStart(2, "0")} / {String(stepOrder.length).padStart(2, "0")}
          </span>

          {current !== "done" && (
            <button
              type="button"
              onClick={skipAll}
              className="hover:text-white transition-colors"
              style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: "0.04em", color: "rgba(255,255,255,0.35)" }}
            >
              Pular por enquanto
            </button>
          )}
        </header>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 pb-14">
          <div className="w-full max-w-xl animate-fade-in" key={current}>
            {/* ------------------------------ Step: goal ------------------------------ */}
            {current === "goal" && (
              <>
                <Eyebrow>Configuração inicial</Eyebrow>
                <H1>BEM-VINDO{firstName ? `, ${firstName.toUpperCase()}` : ""}.</H1>
                <Sub>
                  Dois minutos para transformar contas espalhadas em inteligência
                  patrimonial. O que te trouxe até aqui?
                </Sub>
                <div className="space-y-3">
                  {GOALS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleGoal(g.id)}
                      className="w-full flex items-center justify-between gap-4 p-5 border border-white/[0.08] bg-white/[0.02] hover:border-[#00FF7A]/50 hover:bg-white/[0.04] transition-colors text-left group"
                    >

                      <div>
                        <div style={{ fontFamily: F.display, fontSize: 20, letterSpacing: "0.05em", color: "#fff" }}>
                          {g.label}
                        </div>
                        <div className="mt-1" style={{ fontFamily: F.mono, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                          {g.desc}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-white/20 group-hover:text-[#00FF7A] transition-colors" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* -------------------------- Step: open_finance -------------------------- */}
            {current === "open_finance" && (
              <>
                <Eyebrow>Open Finance · Regulado pelo Banco Central</Eyebrow>
                <H1>CONECTE SEUS BANCOS.</H1>
                <Sub>
                  850+ instituições. Contas, cartões e transações sincronizados
                  automaticamente — a matéria-prima das análises do seu portfólio e dos
                  insights do ZURT Agent.
                </Sub>
                <InfoGrid items={OF_TRUST} />

                {ofCount > 0 && (
                  <div
                    className="mb-6 p-4 border flex items-center gap-3"
                    style={{ borderColor: "rgba(0,255,122,0.3)", background: "rgba(0,255,122,0.05)" }}
                  >
                    <Check className="h-4 w-4 shrink-0" style={{ color: GREEN }} />
                    <span style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: "0.06em", color: GREEN }}>
                      {ofCount > 1
                        ? `${ofCount} INSTITUIÇÕES CONECTADAS — SINCRONIZANDO`
                        : "1 INSTITUIÇÃO CONECTADA — SINCRONIZANDO"}
                    </span>
                  </div>
                )}
                <div className="space-y-3">
                  <CTA onClick={openPluggy} disabled={busy}>
                    {busy ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> ABRINDO...
                      </>
                    ) : ofCount > 0 ? (
                      "CONECTAR OUTRA INSTITUIÇÃO"
                    ) : (
                      "CONECTAR PRIMEIRA INSTITUIÇÃO"
                    )}
                  </CTA>
                  {ofCount > 0 ? (
                    <Ghost onClick={() => { record("open_finance", "completed"); next(); }}>
                      CONTINUAR
                    </Ghost>
                  ) : (
                    <Ghost onClick={() => skipStep("open_finance")}>PULAR ESTA ETAPA</Ghost>
                  )}
                </div>
              </>
            )}

            {/* ------------------------------- Step: b3 -------------------------------- */}
            {current === "b3" && !b3Available && (
              <>
                <Eyebrow>B3 · A Bolsa do Brasil</Eyebrow>
                <div className="inline-block mb-5 px-3 py-1.5 border" style={{ borderColor: "rgba(0,255,122,0.4)" }}>
                  <span style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.14em", color: GREEN }}>
                    CONTRATO ASSINADO · INTEGRAÇÃO EM ATIVAÇÃO
                  </span>
                </div>
                <H1>SEUS INVESTIMENTOS, DIRETO DA FONTE.</H1>
                <Sub>
                  Ações, FIIs, ETFs, BDRs, Tesouro Direto e renda fixa importados
                  automaticamente da B3 — sem planilha, sem digitação manual.
                </Sub>
                <InfoGrid items={B3_VALUE} cols={1} />
                {b3OnList ? (
                  <div className="space-y-3">
                    <div
                      className="p-4 border flex items-start gap-3"
                      style={{ borderColor: "rgba(0,255,122,0.3)", background: "rgba(0,255,122,0.05)" }}
                    >
                      <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: GREEN }} />
                      <div>
                        <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: "0.08em", color: GREEN }}>
                          VOCÊ ESTÁ NA LISTA
                        </div>
                        <div className="mt-1" style={{ fontFamily: F.mono, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                          Ativação automática no lançamento — avisamos por email.
                        </div>
                      </div>
                    </div>
                    <CTA onClick={next}>CONTINUAR</CTA>
                  </div>

                ) : (
                  <div className="space-y-3">
                    <CTA onClick={joinB3Waitlist} disabled={busy}>
                      {busy ? "REGISTRANDO..." : "AVISE-ME NO LANÇAMENTO"}
                    </CTA>
                    <Ghost onClick={() => skipStep("b3")}>AGORA NÃO</Ghost>
                  </div>
                )}
              </>
            )}

            {current === "b3" && b3Available && b3Connected && (
              <>
                <Eyebrow>B3 · A Bolsa do Brasil</Eyebrow>
                <H1>B3 CONECTADA.</H1>
                <Sub>
                  Suas posições na bolsa serão importadas e mantidas em sincronia
                  automaticamente.
                </Sub>
                <CTA onClick={() => { record("b3", "completed"); next(); }}>CONTINUAR</CTA>
              </>
            )}

            {current === "b3" && b3Available && !b3Connected && (
              <>
                <Eyebrow>B3 · A Bolsa do Brasil</Eyebrow>
                <H1>AUTORIZE A CONEXÃO B3.</H1>
                <Sub>
                  {accountCpfMasked
                    ? "Conectamos a B3 com o CPF do seu cadastro — criptografado, nunca exibido, revogável quando quiser."
                    : "Informe o CPF titular dos investimentos. Ele é usado apenas para localizar suas posições na B3 — criptografado, nunca exibido, revogável quando quiser."}
                </Sub>

                {accountCpfMasked ? (
                  /* Conta com CPF registrado: confirmação mascarada, sem input */
                  <div className="space-y-2 mb-6 py-3 px-4 bg-white/[0.03] border border-white/[0.08]">
                    <span
                      className="uppercase block"
                      style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}
                    >
                      CPF do seu cadastro
                    </span>
                    <span className="block text-white" style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: "0.08em" }}>
                      {accountCpfMasked}
                    </span>
                    <p style={{ fontFamily: F.mono, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                      Por segurança, a B3 só pode ser conectada com o CPF do titular da conta.
                    </p>
                    {cpfError && (
                      <p style={{ fontFamily: F.mono, fontSize: 11, color: "#f87171" }}>{cpfError}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 mb-6">
                    <label
                      htmlFor="cpf"
                      className="uppercase block"
                      style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}
                    >
                      CPF
                    </label>
                    <input
                      id="cpf"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => {
                        setCpf(formatCpf(e.target.value));
                        setCpfError(null);
                      }}
                      className="w-full py-3 px-4 bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/20 outline-none focus:border-[#00FF7A]/50 transition-colors"
                      style={{ fontFamily: F.mono, fontSize: 14, letterSpacing: "0.06em" }}
                    />
                    {cpfError && (
                      <p style={{ fontFamily: F.mono, fontSize: 11, color: "#f87171" }}>{cpfError}</p>
                    )}
                  </div>
                )}
                <div className="space-y-3">
                  <CTA onClick={submitB3Consent} disabled={busy}>
                    {busy ? "AUTORIZANDO..." : "AUTORIZAR CONEXÃO B3"}
                  </CTA>
                  <Ghost onClick={() => skipStep("b3")}>PULAR ESTA ETAPA</Ghost>
                </div>
              </>
            )}

            {/* ------------------------------ Step: done ------------------------------- */}
            {current === "done" && (
              <>
                <div
                  className="w-14 h-14 mb-8 flex items-center justify-center border"
                  style={{ borderColor: "rgba(0,255,122,0.4)", background: "rgba(0,255,122,0.08)" }}
                >
                  <Check className="h-7 w-7" style={{ color: GREEN }} />
                </div>
                <H1>PRONTO. A ZURT JÁ ESTÁ TRABALHANDO.</H1>
                <Sub>
                  Primeira sincronização em andamento — seus dados aparecem no painel em
                  instantes. Conecte novas contas quando quiser em Conexões.
                </Sub>
                <div className="mb-8 divide-y divide-white/[0.06] border border-white/[0.06]">
                  <RecapRow
                    label="OPEN FINANCE"
                    value={ofCount > 0 ? (ofCount > 1 ? `${ofCount} conectadas` : "1 conectada") : "pulado"}
                    ok={ofCount > 0}
                  />
                  <RecapRow
                    label="B3"
                    value={b3Connected ? "conectada" : b3OnList ? "lista de espera" : "pulado"}
                    ok={b3Connected || b3OnList}
                  />
                  <RecapRow
                    label="OBJETIVO"
                    value={status?.goal ? GOAL_LABEL[status.goal] : "—"}
                    ok={!!status?.goal}
                  />
                </div>

                <CTA onClick={finish} disabled={busy}>
                  {busy ? (
                    "FINALIZANDO..."
                  ) : (
                    <>
                      IR PARA O PAINEL <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </CTA>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
