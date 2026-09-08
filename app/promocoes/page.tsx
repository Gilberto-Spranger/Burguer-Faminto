'use client';

import React from 'react';
import Image from 'next/image';
import { Tag, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function PromocoesPage() {
  const { products, addToCart } = useStore();
  const promoProducts = products.filter(
    (p) => p.category === 'Promoções' || Boolean(p.promotionalPrice)
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-12 px-4">
        <div className="container mx-auto max-w-7xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 text-xs font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" /> Ofertas Exclusivas em Angola
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-tight">
            Promoções & Combos Famintos
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
            Hambúrgueres artesanais suculentos com descontos que cabem no bolso. Válido para takeaway e delivery em Luanda!
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl overflow-hidden hover:border-[var(--accent-primary)] transition-all flex flex-col group shadow-lg"
            >
              <div className="relative h-56 w-full bg-black">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-red-600 text-white font-display font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Super Promoção
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <h3 className="font-display font-bold text-xl uppercase mb-1">{product.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[var(--text-secondary)] line-through block">
                      {product.price.toLocaleString('pt-AO')} Kz
                    </span>
                    <span className="font-display font-bold text-2xl text-[var(--accent-primary)]">
                      {(product.promotionalPrice || product.price).toLocaleString('pt-AO')} Kz
                    </span>
                  </div>

                  <Button
                    onClick={() => addToCart(product)}
                    className="font-display font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 px-5 bg-[var(--accent-primary)] text-white shadow-md hover:opacity-90"
                  >
                    <ShoppingBag className="w-4 h-4" /> Pedir Agora
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
