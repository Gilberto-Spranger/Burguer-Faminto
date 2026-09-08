'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Heart, Award, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      {/* Hero */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] block">
            A Nossa História em Angola 🇦🇴
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-6xl uppercase tracking-tight">
            Nascidos da Verdadeira Fome
          </h1>
          <p className="text-sm sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            O Burguer Faminto nasceu em Luanda com uma missão simples e voraz: criar o hambúrguer artesanal mais saboroso, suculento e irresistível que alguma vez provaste.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight">
              Ingredientes Frescos, Sabor Sem Compromissos
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Carne 100% bovina selecionada diariamente, pães brioche fofos artesanais tostados na manteiga e molhos caseiros secretos criados pelos nossos mestres chapeiros.
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Não usamos conservantes nem atalhos. Cada smash burger é esmagado na chapa incandescente na hora em que fazes o pedido, criando aquela crosta dourada e caramelizada inconfundível.
            </p>
          </div>

          <div className="relative h-80 rounded-3xl overflow-hidden border border-[var(--border-color)] shadow-2xl bg-black">
            <Image
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80"
              alt="Hambúrguer Burguer Faminto"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mx-auto">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg uppercase">Smash Autêntico</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Chapa a 260°C para selar o sumo da carne e garantir a crosta perfeita.
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg uppercase">Qualidade Máxima</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Queijo cheddar fundido de alta qualidade e bacon fumado extra estaladiço.
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg uppercase">Orgulho de Luanda</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Entregas rápidas por toda a cidade: Maianga, Talatona, Kilamba e Ilha.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link href="/menu">
            <Button size="lg" className="rounded-2xl font-display font-bold uppercase tracking-wider px-10 bg-[var(--accent-primary)] text-white">
              Explorar Nosso Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
