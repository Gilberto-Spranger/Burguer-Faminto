'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-12 px-4 text-center">
        <div className="container mx-auto max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" /> Condições Oficiais
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-tight">
            Termos & Condições de Venda
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Burguer Faminto Angola • Válido para todos os pedidos realizados no ecossistema digital.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12 space-y-8 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-xl uppercase text-[var(--text-primary)]">
            1. Pedidos e Cancelamentos
          </h2>
          <p>
            Uma vez confirmado o pedido e enviado para a chapa da cozinha, o cancelamento só é possível dentro de 2 minutos após a confirmação através do contacto direto via WhatsApp ou telemóvel da loja selecionada.
          </p>
        </section>

        <section className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-xl uppercase text-[var(--text-primary)]">
            2. Prazos e Zonas de Entrega
          </h2>
          <p>
            O tempo médio estimado de entrega é de 25 a 45 minutos dependendo do trânsito na cidade de Luanda e da proximidade à loja correspondente (Maianga, Talatona, Kilamba ou Ilha).
          </p>
        </section>

        <section className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-xl uppercase text-[var(--text-primary)]">
            3. Programa de Fidelização Faminto Points
          </h2>
          <p>
            Os pontos acumulados não são convertíveis em dinheiro e são de uso pessoal e intransmissível através da conta de utilizador registada.
          </p>
        </section>
      </div>
    </div>
  );
}
