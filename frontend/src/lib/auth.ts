import { api, authApi } from './api';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'customer' | 'consultant' | 'admin';
  // BUILD-CPF-IDENTIDADE: 3 últimos dígitos do CPF da conta (exibição
  // mascarada no fluxo B3). null/ausente = conta sem CPF registrado (legada).
  cpf_last3?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private currentUser: User | null = null;

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await authApi.login({ email, password });
    api.setToken(response.token);
    this.currentUser = response.user;
    return response;
  }

  async register(
    full_name: string,
    email: string,
    password: string,
    role: 'customer' | 'consultant' | 'admin' = 'customer',
    invitation_token?: string,
    cpf?: string,
    birth_date?: string
  ): Promise<AuthResponse & { requiresApproval?: boolean; requiresVerification?: boolean; email?: string }> {
    const response = await authApi.register({ full_name, email, password, role, invitation_token, cpf, birth_date });
    if (response.token) {
      api.setToken(response.token);
      this.currentUser = response.user;
    } else {
      this.currentUser = null;
    }
    return response as AuthResponse & { requiresApproval?: boolean; requiresVerification?: boolean; email?: string };
  }

  async registerVerify(email: string, code: string): Promise<AuthResponse & { requiresApproval?: boolean }> {
    const response = await authApi.registerVerify({ email, code });
    if (response.token) {
      api.setToken(response.token);
      this.currentUser = response.user;
    } else {
      this.currentUser = null;
    }
    return response as AuthResponse & { requiresApproval?: boolean };
  }

  async registerResendCode(email: string): Promise<void> {
    await authApi.registerResend({ email });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await authApi.me();
      this.currentUser = response.user;
      return response.user;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout() {
    api.setToken(null);
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null || (typeof window !== 'undefined' && !!localStorage.getItem('auth_token'));
  }

  getCurrentUserSync(): User | null {
    return this.currentUser;
  }
}

export const authService = new AuthService();
