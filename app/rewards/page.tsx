'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Sparkles, Gift, Star, ShieldCheck, ArrowRight, Trophy } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function RewardsPage() {
  const { user } = useStore();

  const tiers = [
    { name: 'INICIANTE', points: '0 - 499 pts', discount: '5% em dias de semana', color: 'from-zinc-700 to-zinc-900' },
    { name: 'FAMINTO', points: '500 - 1.499 pts', discount: 'Bebida grátis a cada 3 pedidos', color: 'from-amber-700 to-amber-900' },
    { name: 'FAMINTO PRO', points: '1.500 - 3.499 pts', discount: 'Entrega grátis + Batata grátis', color: 'from-orange-600 to-red-800' },
    { name: 'LENDÁRIO', points: '3.500+ pts', discount: 'Hambúrguer mensal grátis + Acesso VIP', color: 'from-yellow-500 to-amber-700' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      {/* Hero */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-14 px-4 text-center">
        <div className="container mx-auto max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4" /> Clube Faminto de Recompensas
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-6xl uppercase tracking-tight">
            Come Mais, Ganha Mais
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            Cada kwanza gasto converte-se em pontos que te dão hambúrgueres artesanais, combos duplos e sobremesas sem pagares mais nada.
          </p>

          <div className="pt-2">
            <Link href="/perfil">
              <Button size="lg" className="rounded-2xl font-display font-bold uppercase tracking-wider bg-[var(--accent-primary)] text-white px-8">
                Ver Meus Pontos no Perfil
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="container mx-auto max-w-7xl px-4 py-12 space-y-12">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-center mb-2">
            Níveis de Fidelidade
          </h2>
          <p className="text-center text-xs text-[var(--text-secondary)] mb-8">
            Quanto mais voraz for o teu apetite, maiores são os teus privilégios.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 flex flex-col justify-between hover:border-[var(--accent-primary)] transition-all shadow-lg"
              >
                <div>
                  <div className={`h-2.5 w-12 rounded-full bg-gradient-to-r ${tier.color} mb-4`} />
                  <h3 className="font-display font-bold text-xl uppercase tracking-wide mb-1">{tier.name}</h3>
                  <span className="text-xs font-bold text-[var(--accent-primary)] block mb-3">{tier.points}</span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{tier.discount}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" /> Benefício Vitalício
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
