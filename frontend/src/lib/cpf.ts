// =============================================================================
// Utilidades de CPF (BUILD-CPF-IDENTIDADE T3) — extraídas de Onboarding.tsx
// quando o CPF passou a ser coletado também no registro da SPA.
// Validação de dígitos verificadores ESPELHA o backend (zurt-backend
// src/utils/cpf.ts) — ao mudar lá, mudar aqui.
// LGPD: nada aqui loga nem persiste o CPF; last3 é a única forma exibível.
// =============================================================================

export function onlyDigits(s: string): string {
  return (s || "").replace(/\D/g, "");
}

/** Máscara de digitação: 000.000.000-00 */
export function formatCpf(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`;
  return d;
}

/** Same check-digit validation used server-side (utils/cpf.ts). */
export function isValidCpf(raw: string): boolean {
  const cpf = onlyDigits(raw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (slice: string, factorStart: number): number => {
    let sum = 0;
    let factor = factorStart;
    for (const ch of slice) sum += parseInt(ch, 10) * factor--;
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  if (calc(cpf.slice(0, 9), 10) !== parseInt(cpf[9], 10)) return false;
  if (calc(cpf.slice(0, 10), 11) !== parseInt(cpf[10], 10)) return false;
  return true;
}

/** "•••.•••.••1-23" a partir do cpf_last3 do usuário; null se não houver. */
export function maskCpfFromLast3(last3: string | null | undefined): string | null {
  const d = onlyDigits(last3 || "");
  if (d.length !== 3) return null;
  return `•••.•••.••${d[0]}-${d[1]}${d[2]}`;
}
