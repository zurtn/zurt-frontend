import { api } from './api-client';

export const authApi = {
  // BUILD-CPF-IDENTIDADE: cpf (identidade da conta) e birth_date (gate 18
  // anos) — obrigatórios na UI nova; opcionais no contrato (rollout seguro).
  register: (data: { full_name: string; email: string; password: string; role?: string; invitation_token?: string; cpf?: string; birth_date?: string }) =>
    api.post<{ message?: string; requiresVerification?: boolean; email?: string }>('/auth/register', data),

  registerVerify: (data: { email: string; code: string }) =>
    api.post<{ user: any; token?: string; requiresApproval?: boolean }>('/auth/register/verify', data),

  registerResend: (data: { email: string }) =>
    api.post<{ message?: string }>('/auth/register/resend', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ user: any; token: string }>('/auth/login', data),

  me: () => api.get<{ user: any }>('/auth/me'),

  getInvitationInfo: (token: string) =>
    api.get<{ inviterName: string; inviterEmail: string }>(`/auth/invitation-info?token=${encodeURIComponent(token)}`),
};
