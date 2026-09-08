'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';
import Image from 'next/image';
import { useStore } from '@/lib/store';

const LEVELS = [
  { id: 'petisco', label: 'Ligeira', color: 'bg-green-500', icon: '🟢', message: 'Uma opção leve e rápida para satisfazer o apetite inicial.', category: 'snacks' },
  { id: 'fome', label: 'Moderada', color: 'bg-yellow-500', icon: '🟡', message: 'Uma refeição equilibrada para renovar a sua energia.', category: 'burgers' },
  { id: 'faminto', label: 'Acentuada', color: 'bg-orange-500', icon: '🟠', message: 'Uma opção consistente e altamente satisfatória.', category: 'combos' },
  { id: 'absurda', label: 'Intensa', color: 'bg-[var(--color-faminto-red)]', icon: '🔴', message: 'A nossa melhor seleção para refeições completas.', category: 'combos' },
];

export function FomeMeter() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const { addToCart, products } = useStore();

  const level = selectedLevel !== null ? LEVELS[selectedLevel] : null;
  const recommendedProduct = level 
    ? (products.find((p) => p.category?.toLowerCase() === level.category) || (selectedLevel !== null ? products[selectedLevel % (products.length || 1)] : null) || products[0])
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="text-center mb-6 sm:mb-8 relative z-10">
        <h2 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl uppercase tracking-tighter mb-2">
          Qual é o seu nível de apetite?
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)]">
          Selecione o seu estado atual para receber uma recomendação personalizada.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {LEVELS.map((l, index) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setSelectedLevel(index)}
            className={`
              flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-300
              ${selectedLevel === index 
                ? `border-[var(--color-faminto-red)] bg-[var(--bg-primary)] shadow-[0_0_20px_rgba(230,57,70,0.2)] scale-102` 
                : `border-[var(--border-color)] hover:border-[var(--text-secondary)] hover:bg-[var(--bg-primary)]`
              }
            `}
          >
            <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{l.icon}</span>
            <span className={`font-bold font-display text-xs sm:text-sm uppercase tracking-wide text-center ${selectedLevel === index ? 'text-[var(--accent-primary)]' : ''}`}>
              {l.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedLevel !== null && recommendedProduct && (
          <motion.div
            key={selectedLevel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative z-10 mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center gap-6 sm:gap-8"
          >
            <div className="flex-1 text-center md:text-left w-full">
              <span className="inline-block px-3 py-1 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold text-xs sm:text-sm uppercase rounded-full mb-3 sm:mb-4">
                {level?.message}
              </span>
              <h3 className="font-display font-bold text-xl sm:text-3xl uppercase mb-2 leading-tight">
                Recomendação: <span className="text-gradient block sm:inline">{recommendedProduct.name}</span>
              </h3>
              <p className="text-xs sm:text-base text-[var(--text-secondary)] mb-6 leading-relaxed">
                {recommendedProduct.description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between md:justify-start w-full">
                <span className="font-display font-bold text-2xl sm:text-3xl whitespace-nowrap">
                  {recommendedProduct.price.toLocaleString('pt-AO')} Kz
                </span>
                <Button 
                  size="lg" 
                  variant="faminto"
                  className="w-full sm:w-auto px-6 py-3 font-bold"
                  onClick={() => addToCart(recommendedProduct)}
                >
                  <Utensils className="w-5 h-5 mr-2 shrink-0" />
                  ADICIONAR AO PEDIDO
                </Button>
              </div>
            </div>

            <div className="w-full md:w-1/3 aspect-square relative min-h-[200px] max-w-[280px]">
              <Image
                src={recommendedProduct.image}
                alt={recommendedProduct.name}
                fill
                className="object-contain drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
