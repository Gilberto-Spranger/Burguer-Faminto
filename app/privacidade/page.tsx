'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-12 px-4 text-center">
        <div className="container mx-auto max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Segurança & Transparência
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-tight">
            Política de Privacidade
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Última atualização: Março de 2026 • Em conformidade com a legislação angolana de proteção de dados.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12 space-y-8 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-xl uppercase text-[var(--text-primary)]">
            1. Recolha de Dados Pessoais
          </h2>
          <p>
            O Burguer Faminto recolhe estritamente as informações necessárias para processar e entregar os teus pedidos em Luanda: nome, número de telemóvel para WhatsApp e notificações de entrega, endereço de entrega e histórico de transações.
          </p>
        </section>

        <section className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-xl uppercase text-[var(--text-primary)]">
            2. Segurança nos Pagamentos
          </h2>
          <p>
            Todas as transações via AppyPay e Multicaixa Express são encriptadas de ponta a ponta com protocolos SSL/TLS bancários. O Burguer Faminto não armazena números de cartões bancários nem códigos PIN de telemóveis.
          </p>
        </section>

        <section className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-xl uppercase text-[var(--text-primary)]">
            3. Comunicações e WhatsApp
          </h2>
          <p>
            Ao fornecer o teu número de telefone, autorizas o envio de alertas operacionais sobre o estado do teu pedido (preparação, saída para entrega e chegada do estafeta). Podes desativar comunicações promocionais a qualquer momento nas definições do teu perfil.
          </p>
        </section>
      </div>
    </div>
  );
}
