'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Flame,
  Star,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Utensils,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { ProductCustomizeModal } from '@/components/menu/ProductCustomizeModal';

export default function FavoritosPage() {
  const { products, favorites, toggleFavorite, addToCart, setCartOpen } = useStore();
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const favoriteProducts = useMemo(() => {
    return products.filter((product) => favorites.includes(product.id));
  }, [products, favorites]);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    favoriteProducts.forEach((p) => cats.add(p.category));
    return ['Todos', ...Array.from(cats)];
  }, [favoriteProducts]);

  const filteredFavorites = useMemo(() => {
    if (selectedCategory === 'Todos') return favoriteProducts;
    return favoriteProducts.filter((p) => p.category === selectedCategory);
  }, [favoriteProducts, selectedCategory]);

  const handleAddDirectlyToCart = (product: Product) => {
    addToCart(product, 1);
    setCartOpen(true);
  };

  const handleClearAllFavorites = () => {
    if (typeof window !== 'undefined' && window.confirm('Desejas remover todos os itens dos teus favoritos?')) {
      favorites.forEach((id) => toggleFavorite(id));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-8 sm:py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-4">
            <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
              Início
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/menu" className="hover:text-[var(--accent-primary)] transition-colors">
              Menu
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[var(--text-primary)] font-semibold">Favoritos</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-wider mb-2">
                <Heart className="w-3.5 h-3.5 fill-rose-500" /> Os Teus Burgers Preferidos
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl uppercase tracking-tight">
                Os Meus Favoritos
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {favoriteProducts.length === 1
                  ? 'Tens 1 item guardado na tua lista de preferências.'
                  : `Tens ${favoriteProducts.length} itens guardados na tua lista de preferências.`}
              </p>
            </div>

            {favoriteProducts.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearAllFavorites}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-[var(--border-color)]"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Limpar Favoritos</span>
                </button>

                <Link href="/menu">
                  <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-2 text-xs">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ver Todo o Menu</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {availableCategories.length > 2 && (
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[var(--border-color)]/60">
              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1 mr-2">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filtrar:
              </span>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                      : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16 sm:py-24 max-w-lg mx-auto bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 sm:p-12 shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            
            <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-[var(--text-primary)] mb-2">
              Ainda Não Tens Favoritos
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
              Guarda os teus hambúrgueres artesanais, combos explosivos e acompanhamentos favoritos para fazer pedidos num piscar de olhos sempre que a fome bater.
            </p>

            <Link href="/menu">
              <Button size="lg" className="w-full sm:w-auto px-8 rounded-xl font-bold uppercase tracking-wider text-xs gap-2">
                <Utensils className="w-4 h-4" />
                <span>Explorar Menu Faminto</span>
              </Button>
            </Link>

            {products.length > 0 && (
              <div className="mt-10 pt-6 border-t border-[var(--border-color)] text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] mb-3 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Os Mais Pedidos em Luanda:
                </p>
                <div className="space-y-2">
                  {products.slice(0, 3).map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-[var(--text-primary)] block">{prod.name}</span>
                          <span className="text-[var(--accent-primary)] font-semibold">
                            {(prod.promotionalPrice || prod.price).toLocaleString('pt-AO')} Kz
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(prod.id)}
                        className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:text-rose-500 transition-colors"
                        title="Adicionar aos Favoritos"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredFavorites.map((product) => {
                const effectivePrice = product.promotionalPrice || product.price;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="group bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-primary)]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                        {product.isFeatured && (
                          <span className="px-2.5 py-1 rounded-full bg-[var(--accent-primary)] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            Destaque
                          </span>
                        )}
                        {product.promotionalPrice && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            Promoção
                          </span>
                        )}
                        {product.tags && product.tags.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
                            {product.tags[0]}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-md"
                        aria-label="Remover dos Favoritos"
                        title="Remover dos Favoritos"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 stroke-rose-500" />
                      </button>

                      <div className="absolute bottom-3 left-3 z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)] mb-1">
                          <span className="uppercase tracking-wider font-semibold">{product.category}</span>
                          <span>{product.salesCount}+ pedidos</span>
                        </div>

                        <h3 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1">
                          {product.name}
                        </h3>

                        <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-[var(--border-color)]/60">
                        <div className="flex items-baseline justify-between mb-3">
                          <span className="text-xs text-[var(--text-secondary)]">Preço</span>
                          <div className="flex items-baseline gap-2">
                            {product.promotionalPrice && (
                              <span className="text-xs text-[var(--text-secondary)] line-through">
                                {product.price.toLocaleString('pt-AO')} Kz
                              </span>
                            )}
                            <span className="font-display font-bold text-lg text-[var(--accent-primary)]">
                              {effectivePrice.toLocaleString('pt-AO')} Kz
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedProductForModal(product)}
                            className="w-full py-2.5 px-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--accent-primary)] text-xs font-semibold text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                            <span>Personalizar</span>
                          </button>

                          <button
                            onClick={() => handleAddDirectlyToCart(product)}
                            className="w-full py-2.5 px-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Pedir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ProductCustomizeModal
        product={selectedProductForModal}
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />
    </div>
  );
}
