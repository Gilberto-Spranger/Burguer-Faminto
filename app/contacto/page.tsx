'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactoPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      {/* Header */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-12 px-4 text-center">
        <div className="container mx-auto max-w-4xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] block">
            Apoio ao Cliente & Dúvidas
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-tight">
            Fala Connosco
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
            Precisas de ajuda com um pedido, queres dar sugestões ou elogiar a tua refeição? Estamos sempre aqui!
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Contact Details */}
          <div className="space-y-6">
            <h2 className="font-display font-bold text-2xl uppercase">Canais Diretos</h2>

            <div className="space-y-4">
              <a
                href="https://wa.me/244923456789?text=Ol%C3%A1%20Burguer%20Faminto!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 transition-all text-emerald-400"
              >
                <MessageCircle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-white">WhatsApp de Pedidos</h4>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">
                    Linha rápida para tracking e apoio imediato
                  </p>
                  <span className="font-mono font-bold text-sm text-emerald-400">(+244) 923 456 789</span>
                </div>
              </a>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <Phone className="w-6 h-6 shrink-0 text-[var(--accent-primary)] mt-0.5" />
                <div>
                  <h4 className="font-bold text-base">Linha Telefónica</h4>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">
                    Atendimento de Segunda a Domingo
                  </p>
                  <span className="font-mono font-bold text-sm text-[var(--text-primary)]">(+244) 931 999 888</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <Mail className="w-6 h-6 shrink-0 text-[var(--accent-primary)] mt-0.5" />
                <div>
                  <h4 className="font-bold text-base">E-mail Oficial</h4>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">
                    Para parcerias, fornecedores e eventos
                  </p>
                  <span className="font-bold text-sm text-[var(--text-primary)]">contacto@burguerfaminto.ao</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <Clock className="w-6 h-6 shrink-0 text-[var(--accent-primary)] mt-0.5" />
                <div>
                  <h4 className="font-bold text-base">Horário de Funcionamento</h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Segunda a Domingo: 11:00 às 23:30 (Cozinha fecha às 23:00)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-display font-bold text-xl uppercase">Envia uma Mensagem</h3>
            
            {sent ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <h4 className="font-bold text-base">Mensagem Enviada!</h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  A nossa equipa entrará em contacto contigo pelo teu número de WhatsApp ou e-mail.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1">
                    O Teu Nome
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pedro Silva"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-[var(--accent-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1">
                    Telemóvel (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+244 9xx xxx xxx"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-[var(--accent-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1">
                    Mensagem
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Conta-nos o que precisas..."
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-[var(--accent-primary)] focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-display font-bold uppercase tracking-wider bg-[var(--accent-primary)] text-white"
                >
                  <Send className="w-4 h-4 mr-2" /> Enviar Mensagem
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
