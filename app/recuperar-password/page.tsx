'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [emailSent, setEmailSent] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleRecoverPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setSuccess('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Digite o seu e-mail.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Digite um e-mail válido.');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo: `${window.location.origin}/recuperar-password`,
        }
      );

      if (resetError) {
        throw resetError;
      }

      setEmailSent(true);
      setSuccess(
        'Enviámos um link de recuperação para o teu e-mail. Verifica também a pasta de spam.'
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Não foi possível enviar o e-mail de recuperação.';

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('A nova palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    setUpdatingPassword(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(
        'Palavra-passe alterada com sucesso. Já podes entrar na tua conta.'
      );

      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Não foi possível alterar a palavra-passe.';

      setError(message);
    } finally {
      setUpdatingPassword(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fff8f0] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-8 flex justify-center">
            <Link href="/" aria-label="Burguer Faminto">
              <Image
                src="/logo.png"
                alt="Burguer Faminto"
                width={150}
                height={150}
                className="h-auto w-[130px] object-contain"
                priority
              />
            </Link>
          </div>

          <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-100/50 sm:p-8">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                {resetMode ? (
                  <LockKeyhole className="h-8 w-8" />
                ) : emailSent ? (
                  <CheckCircle2 className="h-8 w-8" />
                ) : (
                  <ShieldCheck className="h-8 w-8" />
                )}
              </div>

              <h1 className="text-2xl font-black tracking-tight text-gray-900">
                {resetMode
                  ? 'Nova palavra-passe'
                  : emailSent
                    ? 'E-mail enviado!'
                    : 'Recuperar palavra-passe'}
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {resetMode
                  ? 'Define uma nova palavra-passe segura para a tua conta.'
                  : emailSent
                    ? 'Segue o link enviado para o teu e-mail para continuares a recuperação.'
                    : 'Introduz o e-mail associado à tua conta e enviaremos um link para redefinir a tua palavra-passe.'}
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium leading-5 text-green-700">
                {success}
              </div>
            )}

            {resetMode ? (
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Nova palavra-passe
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Mínimo de 6 caracteres"
                      autoComplete="new-password"
                      disabled={updatingPassword}
                      className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-sm font-medium text-gray-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
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

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Confirmar palavra-passe
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Repete a nova palavra-passe"
                      autoComplete="new-password"
                      disabled={updatingPassword}
                      className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-sm font-medium text-gray-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                      aria-label={
                        showConfirmPassword
                          ? 'Ocultar palavra-passe'
                          : 'Mostrar palavra-passe'
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updatingPassword ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      A alterar...
                    </>
                  ) : (
                    <>
                      <LockKeyhole className="h-5 w-5" />
                      Alterar palavra-passe
                    </>
                  )}
                </button>
              </form>
            ) : emailSent ? (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setEmailSent(false);
                    setSuccess('');
                    setError('');
                  }}
                  className="flex h-14 w-full items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 px-5 text-sm font-black text-orange-700 transition hover:bg-orange-100"
                >
                  Enviar novamente
                </button>

                <Link
                  href="/login"
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-orange-600 px-5 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700"
                >
                  Voltar para entrar
                </Link>
              </div>
            ) : (
              <form onSubmit={handleRecoverPassword} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    E-mail
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="exemplo@email.com"
                      autoComplete="email"
                      autoFocus
                      disabled={loading}
                      className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 disabled:opacity-60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      A enviar...
                    </>
                  ) : (
                    <>
                      Enviar link de recuperação
                    </>
                  )}
                </button>
              </form>
            )}

            {!resetMode && (
              <div className="mt-7 flex justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 transition hover:text-orange-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para entrar
                </Link>
              </div>
            )}
          </section>

          <p className="mt-6 text-center text-xs leading-5 text-gray-400">
            A tua segurança é importante para nós.
            <br />
            Nunca partilharemos a tua palavra-passe.
          </p>
        </div>
      </div>
    </main>
  );
}
