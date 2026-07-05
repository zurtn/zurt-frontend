import { api } from './api-client';

/**
 * Activation onboarding API -- first-access wizard (connect B3 + Open Finance).
 * Distinct from the investor KYC onboarding (/api/onboarding).
 */

export type B3Availability = 'available' | 'coming_soon';
export type ActivationGoal = 'consolidate' | 'investments' | 'organize' | 'explore';
export type ActivationStepId = 'goal' | 'b3' | 'open_finance' | 'done';
export type B3ConsentStatus = 'none' | 'pending' | 'active' | 'revoked' | 'expired';

export interface ActivationStatus {
  completed_at: string | null;
  goal: ActivationGoal | null;
  steps: Record<string, { action: 'completed' | 'skipped' | 'interested'; at: string }>;
  b3_interest: boolean;
  connections: {
    open_finance: { connected: boolean; count: number };
    b3: { status: B3ConsentStatus };
  };
  features: { b3_connect: B3Availability };
}

export const activationApi = {
  getStatus: () => api.get<ActivationStatus>('/activation'),

  saveStep: (step: ActivationStepId, action: 'completed' | 'skipped', goal?: ActivationGoal) =>
    api.post<{ ok: boolean }>('/activation/step', { step, action, goal }),

  registerB3Interest: () => api.post<{ ok: boolean }>('/activation/b3-interest', {}),

  complete: () =>
    api.post<{ ok: boolean; completed_at: string | null }>('/activation/complete', {}),

  /** Binds the user's CPF for B3 position lookup (encrypted at rest, LGPD-revocable). */
  b3Consent: (cpf: string) => api.post<{ consent: any }>('/b3/consent', { cpf }),
};

/**
 * Post-login router: customers who never finished activation go to /onboarding.
 * FAILS OPEN -- if the endpoint is unreachable (older backend, transient error),
 * the user goes straight to the dashboard. Login must never be blocked by this.
 */
export async function resolvePostLoginPath(role?: string): Promise<string> {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'consultant') return '/consultant/dashboard';
  try {
    const status = await activationApi.getStatus();
    if (!status.completed_at) return '/onboarding';
  } catch {
    // never block login on activation status
  }
  return '/app/dashboard';
}
