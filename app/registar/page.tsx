'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  Camera,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const db = supabase as any;

export default function Registar() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    if (
      !username.trim() ||
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !birthDate ||
      !gender ||
      !password ||
      !confirmPassword
    ) {
      setError(
        'Preencha todos os campos obrigatórios.'
      );
      return;
    }

    if (password.length < 6) {
      setError(
        'A palavra-passe deve ter pelo menos 6 caracteres.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        'As palavras-passe não coincidem.'
      );
      return;
    }

    setLoading(true);

    try {
      const normalizedUsername =
        username.trim().toLowerCase();

      const normalizedEmail =
        email.trim().toLowerCase();

      const normalizedPhone =
        phone.replace(/\s/g, '');

      const {
        data: usernameExists,
        error: usernameError,
      } = await db
        .from('profiles')
        .select('id')
        .eq('username', normalizedUsername)
        .maybeSingle();

      if (usernameError) {
        throw usernameError;
      }

      if (usernameExists) {
        throw new Error(
          'Este username já está em uso.'
        );
      }

      const {
        data: phoneExists,
        error: phoneError,
      } = await db
        .from('profiles')
        .select('id')
        .eq('phone', normalizedPhone)
        .maybeSingle();

      if (phoneError) {
        throw phoneError;
      }

      if (phoneExists) {
        throw new Error(
          'Este número de telefone já está em uso.'
        );
      }

      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            username: normalizedUsername,
            name: name.trim(),
            phone: normalizedPhone,
            birth_date: birthDate,
            gender,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error(
          'Não foi possível criar a conta.'
        );
      }

      let avatarUrl: string | null = null;

      if (avatar) {
        const extension =
          avatar.name
            .split('.')
            .pop()
            ?.toLowerCase() || 'jpg';

        const filePath =
          `${authData.user.id}/avatar.${extension}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from('avatars')
          .upload(
            filePath,
            avatar,
            {
              upsert: true,
              contentType: avatar.type,
            }
          );

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: publicUrlData,
        } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl =
          publicUrlData.publicUrl;
      }

      const { error: profileError } =
        await db
          .from('profiles')
          .upsert({
            id: authData.user.id,
            username: normalizedUsername,
            name: name.trim(),
            email: normalizedEmail,
            phone: normalizedPhone,
            avatar: avatarUrl,
            birth_date: birthDate,
            gender,
          });

      if (profileError) {
        throw profileError;
      }

      if (authData.session) {
        router.replace('/');
        router.refresh();
      } else {
        router.replace(
          '/entrar?registered=true'
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível criar a sua conta.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-primary)]">
            <UserRound
              className="h-7 w-7 text-white"
              strokeWidth={2.2}
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Criar conta
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Preencha os seus dados para começar
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 shadow-sm sm:p-7">
          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >
            <div className="flex justify-center pb-2">
              <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[var(--border-primary)] bg-[var(--bg-primary)]">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(
                      avatar
                    )}
                    alt="Pré-visualização do avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[var(--text-secondary)]">
                    <Camera className="h-6 w-6" />
                    <span className="text-[10px]">
                      Avatar
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    setAvatar(
                      event.target.files?.[0] ??
                        null
                    )
                  }
                />
              </label>
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
              >
                Username
              </label>

              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]" />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  placeholder="@username"
                  autoComplete="username"
                  className="h-12 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
              >
                Nome
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Nome completo"
                autoComplete="name"
                className="h-12 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
              >
                Número de telefone
              </label>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]" />

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+244 9XX XXX XXX"
                  autoComplete="tel"
                  className="h-12 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="birthDate"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
              >
                Data de nascimento
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]" />

                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(event) =>
                    setBirthDate(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="gender"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
              >
                Género
              </label>

              <select
                id="gender"
                value={gender}
                onChange={(event) =>
                  setGender(event.target.value)
                }
                className="h-12 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="">
                  Selecionar género
                </option>
                <option value="male">
                  Masculino
                </option>
                <option value="female">
                  Feminino
                </option>
                <option value="other">
                  Outro
                </option>
                <option value="prefer_not_to_say">
                  Prefiro não dizer
                </option>
              </select>
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
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] pl-12 pr-12 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-secondary)]"
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
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
              >
                Confirmar palavra-passe
              </label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]" />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Repita a palavra-passe"
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] pl-12 pr-12 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-secondary)]"
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

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-primary)] px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}

              {loading
                ? 'A criar conta...'
                : 'Criar conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={() =>
                router.push('/entrar')
              }
              className="font-semibold text-[var(--accent-primary)] hover:underline"
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
