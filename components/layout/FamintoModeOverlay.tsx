'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function FamintoModeOverlay() {
  const { isFamintoMode, setFamintoMode, addToCart, products } = useStore();
  
  const monsterCombo = products.find((p: any) => p.isMonsterCombo || p.category === 'combos') || products[0];

  useEffect(() => {
    if (isFamintoMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFamintoMode]);

  return (
    <AnimatePresence>
      {isFamintoMode && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(230,57,70,0.8)_100%)]"
            />
          </div>

          <button 
            type="button"
            onClick={() => setFamintoMode(false)}
            className="absolute top-6 right-6 z-50 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <motion.div 
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative z-10 w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--color-faminto-red)] rounded-3xl p-8 md:p-12 text-center shadow-[0_0_100px_rgba(230,57,70,0.4)]"
          >
            <Flame className="w-16 h-16 text-[var(--color-faminto-red)] mx-auto mb-6 animate-pulse" />
            
            <h2 className="font-display font-bold text-3xl md:text-5xl uppercase mb-4 text-white">
              Ok. Percebemos que a situação é grave.
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-10">Vamos resolver essa fome.</p>

            {monsterCombo && (
              <div className="bg-[var(--bg-primary)] p-6 rounded-2xl flex flex-col md:flex-row items-center gap-8 text-left border border-[var(--border-color)]">
                <div className="w-32 h-32 relative flex-shrink-0">
                  <Image 
                    src={monsterCombo.image} 
                    alt={monsterCombo.name} 
                    fill 
                    className="object-contain drop-shadow-2xl" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-2xl uppercase mb-2 text-white">{monsterCombo.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">{monsterCombo.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-2xl text-[var(--accent-primary)]">
                      {monsterCombo.price.toLocaleString('pt-AO')} Kz
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10">
              <Button 
                size="lg" 
                variant="faminto" 
                className="w-full text-xl py-8 shadow-[0_0_40px_rgba(230,57,70,0.6)]"
                onClick={() => {
                  if (monsterCombo) addToCart(monsterCombo);
                  setFamintoMode(false);
                }}
              >
                <Flame className="w-6 h-6 mr-3" />
                MANDAR VIR 🔥
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
