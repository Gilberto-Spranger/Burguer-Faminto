'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Search, X, Plus, Flame, SlidersHorizontal } from 'lucide-react';
import { Product } from '@/types';
import { ProductCustomizeModal } from '@/components/menu/ProductCustomizeModal';

const CATEGORIES = ['Todos', 'Burgers', 'Combos', 'Bebidas', 'Sobremesas', 'Promoções', 'Favoritos'];

export default function MenuPage() {
  const { products, isProductsLoading, favorites, isFavorite, toggleFavorite, addToCart } = useStore();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const availableProducts = products || [];

  const filteredProducts = availableProducts.filter((product) => {
    if (activeCategory === 'Favoritos') {
      if (!favorites.includes(product.id)) return false;
    } else if (activeCategory !== 'Todos') {
      if (product.category !== activeCategory) return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(q);
      const matchesDesc = product.description.toLowerCase().includes(q);
      const matchesIng = product.ingredients?.some((ing) => ing.toLowerCase().includes(q));
      return matchesName || matchesDesc || matchesIng;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-6 sm:py-8 sticky top-16 z-30 shadow-md">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--accent-primary)] font-bold mb-1">
                <Flame className="w-3.5 h-3.5" /> O Verdadeiro Sabor Angolano
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl uppercase tracking-tight">
                Menu Faminto
              </h1>
            </div>

            <div className="relative max-w-md w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Pesquisar burgers, combos, ingredientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-secondary)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 relative">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              const favCount = favorites.length;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    relative px-5 py-2 rounded-full whitespace-nowrap font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5
                    ${
                      isActive
                        ? 'text-[var(--bg-primary)]'
                        : 'text-[var(--text-secondary)] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)]/50'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-[var(--text-primary)] rounded-full -z-0"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    {category === 'Favoritos' && (
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isActive
                            ? 'fill-[var(--bg-primary)] text-[var(--bg-primary)]'
                            : 'fill-[var(--accent-primary)] text-[var(--accent-primary)]'
                        }`}
                      />
                    )}
                    {category}
                    {category === 'Favoritos' && (
                      <span
                        className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-[var(--bg-primary)] text-[var(--text-primary)]'
                            : 'bg-[var(--accent-primary)] text-white'
                        }`}
                      >
                        {favCount}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            A mostrar <strong className="text-[var(--text-primary)]">{filteredProducts.length}</strong> itens
            {activeCategory !== 'Todos' && (
              <span> em <strong className="text-[var(--accent-primary)]">{activeCategory}</strong></span>
            )}
          </p>

          {activeCategory === 'Favoritos' && (
            <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
              ❤️ Clica no coração dos produtos para gerir os teus favoritos
            </span>
          )}
        </div>

        {isProductsLoading && availableProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)] mb-4" />
            <p className="text-sm text-[var(--text-secondary)]">A carregar o menu do Burguer Faminto...</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => {
                const fav = isFavorite(product.id);
                const price = product.promotionalPrice || product.price;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="group relative bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[var(--accent-primary)]/80 transition-all hover:shadow-[0_12px_36px_rgba(0,0,0,0.25)] flex flex-col h-full cursor-pointer"
                    onClick={() => setSelectedProductForModal(product)}
                  >
                    <div className="relative h-56 w-full bg-[var(--bg-primary)] overflow-hidden">
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                        {product.tags?.map((tag) => (
                          <div
                            key={tag}
                            className="bg-[var(--accent-primary)] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-md"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className="absolute top-3 right-3 z-10 p-2.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:scale-110 active:scale-95 transition-all shadow-md"
                        title={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        aria-label="Favoritar"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            fav ? 'fill-[var(--accent-primary)] text-[var(--accent-primary)]' : 'text-white'
                          }`}
                        />
                      </button>

                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent" />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-display font-bold text-lg uppercase tracking-wide group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <span className="text-xs font-bold bg-[var(--bg-primary)] border border-[var(--border-color)] px-2 py-0.5 rounded-md text-yellow-400 whitespace-nowrap">
                          ★ {product.rating}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4 flex-1 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]/60 mt-auto">
                        <div className="flex flex-col">
                          {product.promotionalPrice && (
                            <span className="text-[11px] text-[var(--text-secondary)] line-through">
                              {product.price.toLocaleString('pt-AO')} Kz
                            </span>
                          )}
                          <span className="font-display font-bold text-lg text-[var(--accent-primary)]">
                            {price.toLocaleString('pt-AO')} Kz
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {product.category === 'Burgers' ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProductForModal(product);
                              }}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1"
                            >
                              <SlidersHorizontal className="w-3 h-3" /> Montar
                            </button>
                          ) : null}

                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="font-bold text-xs uppercase tracking-wider rounded-lg px-3 py-1.5"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Pedir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {!isProductsLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 px-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
            {activeCategory === 'Favoritos' ? (
              <>
                <Heart className="w-16 h-16 mx-auto mb-4 text-[var(--accent-primary)]/40" />
                <h3 className="font-display text-2xl uppercase mb-2">Ainda não tens favoritos</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">
                  Explora o nosso menu e clica no ícone de coração nos teus burgers e combos preferidos para os encontrares aqui rapidamente!
                </p>
                <Button onClick={() => setActiveCategory('Todos')}>
                  Ver Todo o Menu
                </Button>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 mx-auto mb-4 text-[var(--text-secondary)] opacity-30" />
                <h3 className="font-display text-2xl uppercase mb-2">Nada encontrado</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  Não encontrámos nenhum produto correspondente aos filtros selecionados.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('Todos');
                  }}
                >
                  Limpar Filtros
                </Button>
              </>
            )}
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
