'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Check, Sparkles, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

interface BurgerOption {
  id: string;
  name: string;
  price: number;
  category: 'pao' | 'carne' | 'queijo' | 'extra';
}

const CUSTOMIZE_BUILDER_OPTIONS: BurgerOption[] = [
  { id: 'b1', name: 'Pão Brioche Amanteigado', price: 0, category: 'pao' },
  { id: 'b2', name: 'Pão Australiano Escuro', price: 500, category: 'pao' },
  { id: 'b3', name: 'Pão Rústico com Sésamo', price: 0, category: 'pao' },
  { id: 'm1', name: '1x Carne Artesanal 150g', price: 0, category: 'carne' },
  { id: 'm2', name: '2x Carne Artesanal 150g', price: 2500, category: 'carne' },
  { id: 'm3', name: '3x Carne Artesanal 150g', price: 4500, category: 'carne' },
  { id: 'c1', name: 'Cheddar Cremoso Especial', price: 0, category: 'queijo' },
  { id: 'c2', name: 'Queijo Gouda Curado', price: 800, category: 'queijo' },
  { id: 'c3', name: 'Gorgonzola Suave', price: 1000, category: 'queijo' },
  { id: 'e1', name: 'Bacon Crocante Fumado', price: 1000, category: 'extra' },
  { id: 'e2', name: 'Cebola Caramelizada', price: 500, category: 'extra' },
  { id: 'e3', name: 'Ovo Estrelado na Chapa', price: 500, category: 'extra' },
  { id: 'e4', name: 'Molho Barbecue Faminto', price: 500, category: 'extra' },
  { id: 'e5', name: 'Pickles Artesanais', price: 300, category: 'extra' },
  { id: 'e6', name: 'Jalapeños Picantes', price: 500, category: 'extra' },
];

interface ProductCustomizeModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductCustomizeModal({ product, isOpen, onClose }: ProductCustomizeModalProps) {
  const { addToCart, isFavorite, toggleFavorite } = useStore();

  const [selectedBread, setSelectedBread] = useState('Pão Brioche Amanteigado');
  const [selectedMeat, setSelectedMeat] = useState('1x Carne Artesanal 150g');
  const [selectedCheese, setSelectedCheese] = useState('Cheddar Cremoso Especial');
  const [selectedExtras, setSelectedExtras] = useState<Array<{ name: string; price: number }>>([]);
  const [quantity, setQuantity] = useState(1);
  const [addComboUpgrade, setAddComboUpgrade] = useState(false);

  if (!isOpen || !product) return null;

  const isFav = isFavorite(product.id);
  const basePrice = product.promotionalPrice || product.price;

  const extrasTotal = selectedExtras.reduce((sum, item) => sum + item.price, 0);
  const comboUpgradePrice = addComboUpgrade ? 2000 : 0;
  const unitPrice = basePrice + extrasTotal + comboUpgradePrice;
  const totalPrice = unitPrice * quantity;

  const breads = CUSTOMIZE_BUILDER_OPTIONS.filter((o) => o.category === 'pao');
  const meats = CUSTOMIZE_BUILDER_OPTIONS.filter((o) => o.category === 'carne');
  const cheeses = CUSTOMIZE_BUILDER_OPTIONS.filter((o) => o.category === 'queijo');
  const extras = CUSTOMIZE_BUILDER_OPTIONS.filter((o) => o.category === 'extra');

  const toggleExtra = (extra: { name: string; price: number }) => {
    if (selectedExtras.some((e) => e.name === extra.name)) {
      setSelectedExtras(selectedExtras.filter((e) => e.name !== extra.name));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleAddToCart = () => {
    const finalExtras = [...selectedExtras];
    if (addComboUpgrade) {
      finalExtras.push({ name: 'Upgrade Combo (Batata Frita + Bebida 330ml)', price: 2000 });
    }

    addToCart(
      product,
      quantity,
      finalExtras,
      product.category === 'Burgers'
        ? {
            bread: selectedBread,
            meat: selectedMeat,
            cheese: selectedCheese,
          }
        : undefined
    );
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
        >
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:scale-110 transition-transform"
              aria-label="Favoritar produto"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFav ? 'fill-[var(--accent-primary)] text-[var(--accent-primary)]' : 'text-white'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative h-64 sm:h-72 w-full bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden border-b border-[var(--border-color)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-black/40" />

            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center gap-2 mb-1">
                {product.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[var(--accent-primary)] text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
                <span className="bg-black/60 backdrop-blur-md text-yellow-400 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  ★ {product.rating}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="overflow-y-auto p-6 space-y-6 flex-1 text-[var(--text-primary)]">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {product.description}
            </p>

            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Ingredientes Incluídos
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] px-2.5 py-1 rounded-md text-[var(--text-secondary)]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.category === 'Burgers' && (
              <div className="space-y-5 border-t border-[var(--border-color)] pt-5">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                  <Sparkles className="w-4 h-4" /> Personaliza o Teu Burguer
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                    1. Escolha do Pão
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {breads.map((bread) => (
                      <button
                        key={bread.id}
                        type="button"
                        onClick={() => setSelectedBread(bread.name)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between gap-1 ${
                          selectedBread === bread.name
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 font-bold'
                            : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{bread.name}</span>
                          {selectedBread === bread.name && <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                        </div>
                        {bread.price > 0 && (
                          <span className="text-[var(--accent-primary)] font-bold">+{bread.price} Kz</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                    2. Carne Artesanal
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {meats.map((meat) => (
                      <button
                        key={meat.id}
                        type="button"
                        onClick={() => setSelectedMeat(meat.name)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between gap-1 ${
                          selectedMeat === meat.name
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 font-bold'
                            : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{meat.name}</span>
                          {selectedMeat === meat.name && <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                        </div>
                        {meat.price > 0 && (
                          <span className="text-[var(--accent-primary)] font-bold">+{meat.price} Kz</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                    3. Tipo de Queijo
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {cheeses.map((cheese) => (
                      <button
                        key={cheese.id}
                        type="button"
                        onClick={() => setSelectedCheese(cheese.name)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between gap-1 ${
                          selectedCheese === cheese.name
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 font-bold'
                            : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{cheese.name}</span>
                          {selectedCheese === cheese.name && <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                        </div>
                        {cheese.price > 0 && (
                          <span className="text-[var(--accent-primary)] font-bold">+{cheese.price} Kz</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                    4. Extras & Toppings (Opcional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {extras.map((extra) => {
                      const isSelected = selectedExtras.some((e) => e.name === extra.name);
                      return (
                        <button
                          key={extra.id}
                          type="button"
                          onClick={() => toggleExtra({ name: extra.name, price: extra.price })}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 font-bold'
                              : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--text-primary)]'
                          }`}
                        >
                          <span>{extra.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[var(--accent-primary)] font-bold">+{extra.price} Kz</span>
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white'
                                  : 'border-[var(--border-color)]'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {product.category !== 'Combos' && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--accent-primary)]/20 via-[var(--bg-primary)] to-[var(--bg-primary)] border border-[var(--accent-primary)]/40 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5 mb-1">
                    <span>🍟 UPGRADE PARA COMBO</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Adiciona Batata Frita Dourada + Coca-Cola lata 330ml gelada por apenas{' '}
                    <strong className="text-[var(--text-primary)]">+2.000 Kz</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAddComboUpgrade(!addComboUpgrade)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    addComboUpgrade
                      ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  {addComboUpgrade ? '✓ Adicionado' : '+ Adicionar'}
                </button>
              </div>
            )}
          </div>

          <div className="p-5 bg-[var(--bg-primary)] border-t border-[var(--border-color)] flex items-center justify-between gap-4">
            <div className="flex items-center border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-display font-bold text-base">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 rounded-xl font-display font-bold text-base uppercase tracking-wider flex items-center justify-between px-6"
            >
              <span>Adicionar ao Pedido</span>
              <span>{totalPrice.toLocaleString('pt-AO')} Kz</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
