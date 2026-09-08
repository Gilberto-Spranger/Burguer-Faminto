'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Flame, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Product } from '@/types';
import { FomeMeter } from '@/components/ui/fome-meter';

export default function HomePage() {
  const { products, setFamintoMode } = useStore();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[var(--bg-primary)] py-12 lg:py-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 dark:opacity-30 blur-3xl rounded-full bg-gradient-to-tr from-[var(--color-faminto-red)] to-[var(--color-faminto-orange)] mix-blend-screen" />
        </div>

        <div className="container relative z-20 mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-6 pt-10 lg:pt-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 w-max shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Aberto agora para Delivery</span>
            </div>

            <h1 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tighter">
              ESTÁS COM <br/> 
              <span className="text-gradient">FOME?</span>
            </h1>

            <p className="text-base sm:text-xl text-[var(--text-secondary)] max-w-md leading-relaxed">
              Então pare de pensar. Escolha o seu pedido e deixe o resto connosco.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 sm:pt-4">
              <Button size="lg" variant="faminto" className="group" asChild>
                <Link href="/menu">
                  🍔 PEDIR AGORA
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/menu">VER MENU</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative h-[350px] sm:h-[500px] lg:h-[600px] w-full hidden sm:block"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-full h-full relative z-10"
            >
              <Image
                src="/produtos/hamburguer.png"
                alt="Hambúrguer Faminto"
                fill
                className="object-contain drop-shadow-2xl rounded-3xl"
                priority
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-[var(--bg-secondary)] relative z-30 rounded-t-[2.5rem]">
        <div className="container mx-auto px-4">
          <FomeMeter />
        </div>
      </section>

      <section className="bg-[var(--color-faminto-black)] border-y border-[var(--border-color)] py-12 sm:py-16 text-center">
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button 
              onClick={() => setFamintoMode(true)}
              className="group relative px-6 py-4 sm:px-8 bg-white text-black font-display text-xl sm:text-2xl font-bold uppercase tracking-wider rounded-xl overflow-hidden shadow-2xl transition-all hover:shadow-[0_0_40px_rgba(230,57,70,0.6)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-faminto-red)] group-hover:animate-pulse" />
                ATIVAR FAMINTO MODE
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-faminto-red)] to-[var(--color-faminto-orange)] opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
          </motion.div>
          <p className="mt-4 text-xs sm:text-sm text-white/50">Ative este modo em situações de apetite elevado.</p>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[var(--bg-primary)]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl mb-2">MAIS PEDIDOS</h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)]">As opções preferidas dos nossos clientes.</p>
            </div>
            <Link href="/menu" className="hidden sm:inline-flex items-center text-[var(--accent-primary)] hover:underline font-medium font-display tracking-wide">
              VER TODOS <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();

  return (
    <div className="group relative bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[var(--accent-primary)] transition-colors flex flex-col">
      <div className="relative h-48 w-full bg-[var(--bg-primary)] p-4 flex items-center justify-center">
        {product.tags?.[0] && (
          <div className="absolute top-4 left-4 z-10 bg-[var(--accent-primary)] text-white text-xs font-bold px-2 py-1 rounded-md uppercase">
            {product.tags[0]}
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-xl uppercase tracking-wide mb-2">{product.name}</h3>
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {product.promotionalPrice && (
              <span className="text-xs text-[var(--text-secondary)] line-through">
                {product.price.toLocaleString('pt-AO')} Kz
              </span>
            )}
            <span className="font-display font-bold text-lg text-[var(--accent-primary)]">
              {(product.promotionalPrice || product.price).toLocaleString('pt-AO')} Kz
            </span>
          </div>
          
          <Button size="sm" variant="outline" className="font-bold" onClick={() => addToCart(product)}>
            + ADD
          </Button>
        </div>
      </div>
    </div>
  );
}
