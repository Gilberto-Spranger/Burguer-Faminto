'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart } = useStore();
  
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = 1500; // Mock delivery fee
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-secondary)] shadow-2xl z-50 flex flex-col border-l border-[var(--border-color)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
              <h2 className="font-display font-bold text-2xl uppercase flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" /> O Teu Pedido
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-[var(--bg-primary)] rounded-full transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-[var(--text-secondary)]">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="font-display text-xl">&ldquo;A tua fome está a reclamar.&rdquo;</p>
                  <Button variant="outline" onClick={() => setCartOpen(false)}>
                    IR PARA O MENU
                  </Button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-[var(--bg-primary)] rounded-lg flex-shrink-0 relative p-2">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain drop-shadow-md"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm uppercase">{item.product.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {item.extras && item.extras.length > 0 && (
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          + {item.extras.map(e => e.name).join(', ')}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center gap-3 bg-[var(--bg-primary)] rounded-md border border-[var(--border-color)]">
                          <button 
                            className="px-2 py-1 text-sm font-bold hover:text-[var(--accent-primary)]"
                            onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                          >
                            -
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 text-sm font-bold hover:text-[var(--accent-primary)]"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-[var(--accent-primary)]">
                          {item.totalPrice.toLocaleString('pt-AO')} Kz
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-[var(--border-color)] p-6 bg-[var(--bg-primary)] space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Subtotal</span>
                    <span>{subtotal.toLocaleString('pt-AO')} Kz</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Taxa de Entrega (Média)</span>
                    <span>{deliveryFee.toLocaleString('pt-AO')} Kz</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-[var(--border-color)]">
                    <span>Total</span>
                    <span className="text-[var(--accent-primary)]">{total.toLocaleString('pt-AO')} Kz</span>
                  </div>
                </div>
                
                <p className="text-center text-xs text-[var(--text-secondary)] pb-2 font-medium">
                  A tua fome está a 1 passo de ser resolvida.
                </p>

                <Button size="lg" variant="faminto" className="w-full flex justify-between group" asChild>
                  <Link href="/checkout" onClick={() => setCartOpen(false)}>
                    <span>FINALIZAR PEDIDO</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
