import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const navigate = useNavigate();
  const { loginAsync, isLoggingIn } = useAuth();
  const { t } = useTranslation(['auth', 'common']);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await loginAsync({ email, password });
      const userRole = response?.user?.role;
      let redirectPath = "/app/dashboard";
      if (userRole === 'consultant') redirectPath = "/consultant/dashboard";
      else if (userRole === 'admin') redirectPath = "/admin/dashboard";
      navigate(redirectPath);
    } catch (err: any) {
      if (err?.approval_status === 'pending') {
        setError(err?.message || t('login.pendingApproval'));
      } else if (err?.approval_status === 'rejected') {
        setError(err?.message || t('login.rejected'));
      } else {
        setError(err?.error || t('login.loginError'));
      }
    }
  };

  const handleGoogleLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL ||
      (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? 'http://localhost:5000/api'
        : `${window.location.origin}/api`);
    window.location.href = `${apiBaseUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-white/[0.06]">
        {/* Big Z background */}
        <div
          className="absolute -right-16 -bottom-20 select-none pointer-events-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '320px', lineHeight: 1, color: 'rgba(255,255,255,0.02)' }}
        >
          Z
        </div>

        {/* Top — Logo */}
        <div>
          <Link to="/" className="inline-block">
            <span
              className="text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '0.1em' }}
            >
              ZURT
            </span>
          </Link>
        </div>

        {/* Center — Headline */}
        <div className="relative z-10">
          <div
            className="mb-8"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', color: '#00FF7A', textTransform: 'uppercase' as const, display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <span style={{ width: '32px', height: '1px', background: '#00FF7A', display: 'inline-block' }} />
            Inteligência Patrimonial
          </div>
          <h1
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 5vw, 72px)', lineHeight: 0.92, color: '#fff', letterSpacing: '0.01em', margin: 0 }}
          >
            TODO SEU<br />PATRIMÔNIO.<br />
            <span style={{ color: '#00FF7A' }}>UMA VISÃO.</span>
          </h1>
          <p
            className="mt-6"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: '360px' }}
          >
            Open Finance + B3 + Inteligência Artificial<br />
            em um único painel.
          </p>
        </div>

        {/* Bottom — Stats */}
        <div className="flex gap-12 pt-8 border-t border-white/[0.06]">
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#fff' }}>850+</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', marginTop: '4px' }}>Instituições</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#fff' }}>B3</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', marginTop: '4px' }}>Integração</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#fff' }}>IA</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', marginTop: '4px' }}>ZURT Agent</div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6" style={{ background: '#0a0a0a' }}>
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link to="/">
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '0.1em', color: '#fff' }}>
              ZURT
            </span>
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {/* Title */}
          <h2
            className="mb-8"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#fff', letterSpacing: '0.06em' }}
          >
            ENTRAR
          </h2>

          {error && (
            <Alert variant="destructive" className="mb-5 bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 border border-white/[0.08] bg-transparent text-white/70 hover:border-white/20 transition-colors"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', letterSpacing: '0.04em' }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>OU</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, display: 'block' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-3 px-4 bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/20 outline-none focus:border-[#00FF7A]/50 transition-colors"
                style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px' }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}
                >
                  Senha
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#00FF7A', letterSpacing: '0.04em' }}
                >
                  Esqueci a senha
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-3 px-4 pr-12 bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/20 outline-none focus:border-[#00FF7A]/50 transition-colors"
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#00FF7A] text-black font-medium hover:opacity-85 transition-opacity disabled:opacity-50"
              style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', letterSpacing: '0.06em' }}
            >
              {isLoggingIn ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-8 text-center">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              Sem conta?{' '}
              <Link to="/register" style={{ color: '#00FF7A' }}>
                Criar conta
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
