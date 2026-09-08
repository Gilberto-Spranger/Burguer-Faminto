'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react';
import { supabase } from '@lib/supabase';

export default function Entrar() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const isPhone = /^[+\d][\d\s()-]{5,}$/.test(identifier.trim());

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!identifier.trim() || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const credentials = isPhone
        ? {
            phone: identifier.replace(/\s/g, ''),
            password,
          }
        : {
            email: identifier.trim(),
            password,
          };

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword(credentials);

      if (signInError) throw signInError;

      if (!data.session) {
        throw new Error('Não foi possível iniciar a sessão.');
      }

      router.replace('/');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível entrar na sua conta.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'x') => {
    setSocialLoading(provider);
    setError('');

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (oauthError) throw oauthError;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível iniciar o login.'
      );
      setSocialLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-primary)]">
            <UserRound
              className="h-7 w-7 text-white"
              strokeWidth={2.2}
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Entrar
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Entre na sua conta para continuar
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 shadow-sm sm:p-7">
          <div className="grid grid-cols-3 gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading || socialLoading !== null}
              className="flex h-12 items-center justify-center rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Entrar com Google"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <img
                  src="/oauth-icons/google.png"
                  alt="Google"
                  className="h-6 w-6 object-contain"
                />
              )}
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleOAuthLogin('facebook')}
              disabled={loading || socialLoading !== null}
              className="flex h-12 items-center justify-center rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Entrar com Facebook"
            >
              {socialLoading === 'facebook' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <img
                  src="/oauth-icons/facebook.png"
                  alt="Facebook"
                  className="h-6 w-6 object-contain"
                />
              )}
            </button>

            {/* X */}
            <button
              type="button"
              onClick={() => handleOAuthLogin('x')}
              disabled={loading || socialLoading !== null}
              className="flex h-12 items-center justify-center rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Entrar com X"
            >
              {socialLoading === 'x' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <img
                  src="/oauth-icons/x.png"
                  alt="X"
                  className="h-6 w-6 object-contain"
                />
              )}
            </button>
          </div>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--border-primary)]" />

            <span className="text-xs text-[var(--text-secondary)]">
              ou
            </span>

            <div className="h-px flex-1 bg-[var(--border-primary)]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
              >
                E-mail ou número de telefone
              </label>

              <div className="relative">
                {isPhone ? (
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]" />
                ) : (
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]" />
                )}

                <input
                  id="identifier"
                  type={isPhone ? 'tel' : 'email'}
                  value={identifier}
                  onChange={(event) =>
                    setIdentifier(event.target.value)
                  }
                  placeholder="E-mail ou telefone"
                  autoComplete="username"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent-primary)] disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
              >
                Palavra-passe
              </label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]" />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Digite a sua palavra-passe"
                  autoComplete="current-password"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] pl-12 pr-12 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent-primary)] disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                  aria-label={
                    showPassword
                      ? 'Ocultar palavra-passe'
                      : 'Mostrar palavra-passe'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  router.push('/recuperar-password')
                }
                className="text-sm font-medium text-[var(--accent-primary)] hover:underline"
              >
                Esqueceu a palavra-passe?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || socialLoading !== null}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-primary)] px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}

              {loading ? 'A entrar...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Ainda não tem uma conta?{' '}
            <button
              type="button"
              onClick={() => router.push('/registar')}
              className="font-semibold text-[var(--accent-primary)] hover:underline"
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
