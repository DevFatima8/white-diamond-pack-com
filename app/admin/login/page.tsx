'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/admin/ui';

/**
 * Only allow redirects to our own admin pages after login. Otherwise a link like
 * /admin/login?callbackUrl=https://evil.example could send the admin to a fake site.
 */
function safeCallback(url: string | null): string {
  if (!url || !url.startsWith('/admin') || url.startsWith('//') || url.startsWith('/admin/login')) return '/admin';
  return url;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
      });
      const data: { success?: boolean; message?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.message || 'Sign in failed. Please try again.');
        setLoading(false);
        return;
      }
      router.replace(safeCallback(searchParams.get('callbackUrl')));
      router.refresh();
      // keep the button in its loading state while the dashboard loads
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] rounded-2xl bg-white px-6 py-9 shadow-level-3 sm:px-10">
      <div className="mb-7 flex flex-col items-center text-center">
        <Image src="/images/logo-web.png" alt="White Diamond" width={800} height={267} priority className="h-16 w-auto" />
        <p className="mt-4 text-sm text-brand-muted">Admin panel — catalogue, orders and messages</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Secure sign-in
        </span>
      </div>

      {error && (
        <div
          className="mb-5 flex items-start gap-2 rounded-xl border border-brand-primary/25 bg-[#FFF1F2] px-3.5 py-3 text-sm text-brand-primary"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="identifier" className="mb-1.5 block text-[13px] font-semibold text-brand-ink">
            Email or username
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              id="identifier"
              type="text"
              autoComplete="username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-12 w-full rounded-xl border border-brand-border pl-10 pr-4 text-sm text-brand-ink focus:border-brand-secondary focus:outline-none focus:ring-[3px] focus:ring-brand-secondary/15"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-brand-ink">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-brand-border pl-10 pr-12 text-sm text-brand-ink focus:border-brand-secondary focus:outline-none focus:ring-[3px] focus:ring-brand-secondary/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-brand-navy"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" size="lg" loading={loading} disabled={!identifier || !password} className="mt-2 h-12 w-full">
          {loading ? 'Signing in…' : 'Sign in'}
          {!loading && <ArrowRight className="h-4 w-4" aria-hidden />}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-brand-muted">
        Restricted area. Authorised White Diamond staff only.
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      dir="ltr"
      lang="en"
      className="flex min-h-screen items-center justify-center bg-brand-navy-dark bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.22),transparent_60%)] p-4 font-sans"
    >
      {/* useSearchParams needs a Suspense boundary in the App Router */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
