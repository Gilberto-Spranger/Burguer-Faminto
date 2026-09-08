'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Utensils, Search, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Ilustração / Ícone Animado 404 */}
        <div className="relative inline-block">
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-dashed border-amber-500/30 animate-pulse">
            <span className="text-6xl sm:text-7xl select-none">🍔</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg border-2 border-[var(--bg-color)] flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>404</span>
          </div>
        </div>

        {/* Título e Mensagem */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ops! Hambúrguer Não Encontrado
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Parece que a página que procuras foi devorada ou nunca existiu no nosso menu.
          </p>
        </div>

        {/* Caixas de Ação Rápida */}
        <div className="grid grid-cols-1 gap-3 text-left pt-2">
          <Link
            href="/"
            className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm group-hover:text-amber-500 transition-colors">Página Inicial</p>
              <p className="text-xs text-[var(--text-muted)]">Voltar ao início do Burguer Faminto</p>
            </div>
          </Link>

          <Link
            href="/#cardapio"
            className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm group-hover:text-amber-500 transition-colors">Ver Menu & Combos</p>
              <p className="text-xs text-[var(--text-muted)]">Explorar as nossas opções mais saborosas</p>
            </div>
          </Link>
        </div>

        {/* Botão de Regresso */}
        <div className="pt-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-[var(--border-color)]/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Página Anterior</span>
          </button>
        </div>

      </div>
    </div>
  );
}
