import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const exploreLinks = [
  {
    href: '/menu',
    label: 'Todo o Menu',
    icon: '🍔',
  },
  {
    href: '/promocoes',
    label: 'Promoções & Combos',
    icon: '🔥',
  },
  {
    href: '/favoritos',
    label: 'Os Meus Favoritos',
    icon: '❤️',
  },
  {
    href: '/rewards',
    label: 'Faminto Rewards',
    icon: '🏆',
  },
  {
    href: '/lojas',
    label: 'Nossas Lojas',
    icon: '📍',
  },
  {
    href: '/perfil',
    label: 'Minha Conta & Pedidos',
    icon: '👤',
  },
];

const companyLinks = [
  {
    href: '/sobre',
    label: 'Sobre o Burguer Faminto',
  },
  {
    href: '/contacto',
    label: 'Contactos & Apoio',
  },
  {
    href: '/privacidade',
    label: 'Política de Privacidade',
  },
  {
    href: '/termos',
    label: 'Termos e Condições',
  },
];

const socialLinks = [
  {
    href: 'https://instagram.com/burguerfaminto',
    label: 'Instagram',
    image: '/oauth-icons/instagram.png',
  },
  {
    href: 'https://tiktok.com/@burguerfaminto',
    label: 'TikTok',
    image: '/oauth-icons/tiktok.png',
  },
  {
    href: 'https://facebook.com/burguerfaminto',
    label: 'Facebook',
    image: '/oauth-icons/facebook.png',
  },
  {
    href: 'https://wa.me/',
    label: 'WhatsApp',
    image: '/oauth-icons/whatsapp.png',
  },
  {
    href: 'https://x.com/burguerfaminto',
    label: 'X',
    image: '/oauth-icons/x.png',
  },
  {
    href: 'https://youtube.com/@burguerfaminto',
    label: 'YouTube',
    image: '/oauth-icons/youtube.png',
  },
  {
    href: 'https://pinterest.com/burguerfaminto',
    label: 'Pinterest',
    image: '/oauth-icons/pinterest.png',
  },
];

const paymentMethods = [
  {
    name: 'Multicaixa Express',
    image: '/payment_methods/express.png',
  },
  {
    name: 'Referência Multicaixa',
    image: '/payment_methods/multicaixa.png',
  },
  {
    name: 'UNITEL Money',
    image: '/payment_methods/unitelmoney.png',
  },
  {
    name: 'Débito Directo',
    image: '/payment_methods/debitodirecto.png',
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.25fr] lg:gap-8 xl:gap-12">
          <section className="min-w-0">
            <Link
              href="/"
              aria-label="Burguer Faminto - Página inicial"
              className="inline-flex items-center transition-opacity hover:opacity-80"
            >
              <span className="font-display text-2xl font-bold tracking-tighter sm:text-3xl">
                BURGUER
                <span className="text-[var(--accent-primary)]">
                  FAMINTO
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--text-secondary)] sm:text-[15px]">
              Hambúrgueres artesanais e smash burgers irresistíveis feitos
              para saciar a tua fome mais voraz em Luanda.
            </p>

            <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-emerald-400">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider sm:text-[11px]">
                Aberto para Delivery
              </span>
            </div>
          </section>

          <section className="min-w-0">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-primary)] sm:text-sm">
              Explorar
            </h3>

            <nav aria-label="Explorar">
              <ul className="space-y-1">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex min-h-9 items-center gap-2 rounded-lg py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
                    >
                      <span className="flex w-5 shrink-0 items-center justify-center text-sm">
                        {link.icon}
                      </span>

                      <span className="min-w-0 truncate">
                        {link.label}
                      </span>

                      <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          <section className="min-w-0">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-primary)] sm:text-sm">
              Empresa & Apoio
            </h3>

            <nav aria-label="Empresa e apoio">
              <ul className="space-y-1">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex min-h-9 items-center gap-2 rounded-lg py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
                    >
                      <span className="min-w-0 truncate">
                        {link.label}
                      </span>

                      <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          <section className="min-w-0">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-primary)] sm:text-sm">
              Canais Oficiais
            </h3>

            <div className="space-y-3">
              <a
                href="https://wa.me/244923456789?text=Ol%C3%A1%20Burguer%20Faminto!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-3 text-sm font-semibold text-emerald-400 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10"
              >
                <MessageCircle className="h-5 w-5 shrink-0" />

                <span className="min-w-0">
                  <span className="block text-[10px] font-normal uppercase tracking-wider opacity-70">
                    WhatsApp
                  </span>

                  <span className="block truncate">
                    (+244) 923 456 789
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />

                <span>Seg - Dom: 11:00 às 23:30</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                <span>Maianga, Talatona, Kilamba & Ilha</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                  >
                    <Image
                      src={social.image}
                      alt={social.label}
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain"
                    />

                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="my-8 h-px w-full bg-[var(--border-color)]/60 sm:my-10" />

        <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-primary)] sm:text-sm">
                Pagamentos Aceites
              </p>

              <div className="hidden items-center gap-1.5 text-[10px] font-medium text-emerald-400 sm:flex">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Pagamento seguro</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="flex min-h-[52px] items-center justify-between gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5 transition-all duration-200 hover:border-[var(--accent-primary)] hover:shadow-md"
                >
                  <span className="min-w-0 flex-1 text-xs font-semibold leading-4 text-[var(--text-secondary)] sm:text-[13px]">
                    {method.name}
                  </span>

                  <div className="flex h-9 w-[76px] shrink-0 items-center justify-end">
                    <Image
                      src={method.image}
                      alt={method.name}
                      width={100}
                      height={40}
                      sizes="76px"
                      className="h-auto max-h-9 w-auto max-w-[76px] object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 lg:max-w-[220px] lg:justify-end lg:pt-8 lg:text-right">
            <ShieldCheck className="h-5 w-5 shrink-0" />

            <span>
              Pagamento Seguro e Certificado em Angola
            </span>
          </div>
        </section>

        <div className="my-7 h-px w-full bg-[var(--border-color)]/60" />

        <div className="flex flex-col gap-3 text-center text-xs text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {currentYear} Burguer Faminto Angola. Todos os direitos
            reservados.
          </p>

          <p className="flex items-center justify-center gap-1 sm:justify-end">
            <span>Feito com orgulho em Angola 🇦🇴</span>
            <span className="hidden sm:inline">•</span>
            <span>Luanda</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
