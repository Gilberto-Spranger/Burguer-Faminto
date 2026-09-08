'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Search,
  User as UserIcon,
  Menu,
  X,
  MapPin,
  Flame,
  Award,
  Sparkles,
  Phone,
  MessageCircle,
  ChevronRight,
  Zap,
  Clock,
  Heart,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Star,
  CheckCircle2,
  Info,
  SlidersHorizontal,
  ArrowRight,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Package,
  Gift,
  Compass,
  Home,
  MenuSquare,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const {
    user,
    selectedStore,
    setFamintoMode,
    favorites,
    notifications,
    markAllNotificationsRead,
    setSelectedStore,
    cart,
    setCartOpen,
  } = useStore();

  // Estados locais para controle de menus e painéis suspensos
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [storeSelectorOpen, setStoreSelectorOpen] = useState(false);

  // Referências para tratamento de cliques fora dos menus suspensos
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const storeSelectorRef = useRef<HTMLDivElement>(null);

  // Cálculo de notificações não lidas diretamente do estado global do Zustand
  const unreadNotifications = notifications.filter((n) => !n.read);
  const unreadNotificationsCount = unreadNotifications.length;

  // Total de itens no carrinho
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fechar menu mobile automaticamente na navegação entre rotas
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }

  // Efeito para tratar cliques fora dos modais suspensos (Dropdowns)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        storeSelectorRef.current &&
        !storeSelectorRef.current.contains(event.target as Node)
      ) {
        setStoreSelectorOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Bloquear rolagem do corpo da página quando o menu mobile de navegacao estiver aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Lista simulada de unidades em Luanda para o seletor rápido no topo
  const availableStores = [
    { id: '1', name: 'Burguer Faminto - Talatona', neighborhood: 'Talatona', status: 'Aberto' },
    { id: '2', name: 'Burguer Faminto - Miramar', neighborhood: 'Miramar', status: 'Aberto' },
    { id: '3', name: 'Burguer Faminto - Kilamba', neighborhood: 'Kilamba', status: 'Aberto' },
    { id: '4', name: 'Burguer Faminto - Maianga', neighborhood: 'Maianga', status: 'Aberto' },
  ];

  // Items de navegação para o menu mobile
  const navItems = [
    { label: 'Início', icon: Home, href: '/' },
    { label: 'Menu', icon: MenuSquare, href: '/menu' },
    { label: 'Carrinho', icon: ShoppingBag, isCart: true },
    { label: 'Lojas', icon: MapPin, href: '/lojas' },
    { label: 'Perfil', icon: UserIcon, href: '/perfil' },
  ];

  return (
    <>
      {/* Faixa Promocional / Status de Atendimento Superior */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white text-[11px] font-semibold py-1 px-4 shadow-inner">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold shrink-0">
              Entrega Rápida
            </span>
            <span className="truncate hidden sm:inline">
              Peça agora os melhores hambúrgueres artesanais de Luanda com entrega expressa!
            </span>
            <span className="truncate sm:hidden">Entregas rápidas em Luanda!</span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href="https://wa.me/244900000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline text-white/90 hover:text-white"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Apoio ao Cliente</span>
            </a>
            <div className="h-3 w-[1px] bg-white/30 hidden md:block" />
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-yellow-300" />
              <span>10:00 - 23:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cabeçalho de Navegação Principal (Navbar) */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-md transition-colors shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">

          {/* Lado Esquerdo: Hambúrguer Mobile & Logótipo da Marca */}
          <div className="flex items-center gap-3">
            <button
              id="top-nav-menu-button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Abrir Menu de Navegação"
              className="lg:hidden p-2 -ml-2 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] active:scale-95 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[var(--accent-primary)] transition-transform rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform" />
              )}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display font-bold text-2xl sm:text-3xl tracking-tighter group-hover:scale-105 transition-transform duration-200">
                BURGUER<span className="text-[var(--accent-primary)]">FAMINTO</span>
              </span>
            </Link>

            {/* Indicator de Loja Aberta para Telas Grandes */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs ml-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold uppercase tracking-wider text-[10px]">Aberto Agora</span>
            </div>
          </div>

          {/* Centro: Links Principais de Navegação */}
          <nav className="hidden lg:flex items-center gap-6 font-medium text-sm">
            <Link
              href="/menu"
              className={`hover:text-[var(--accent-primary)] transition-colors py-1 ${
                pathname === '/menu' ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'
              }`}
            >
              Menu
            </Link>
            <Link
              href="/promocoes"
              className={`hover:text-[var(--accent-primary)] transition-colors py-1 flex items-center gap-1 ${
                pathname === '/promocoes' ? 'text-[var(--accent-primary)] font-bold' : 'text-gradient font-bold'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              Promoções 🔥
            </Link>
            <Link
              href="/rewards"
              className={`hover:text-[var(--accent-primary)] transition-colors py-1 flex items-center gap-1 ${
                pathname === '/rewards' ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'
              }`}
            >
              <Award className="w-4 h-4 text-yellow-500" />
              Rewards
            </Link>

            {/* Menu Suspenso Seletor de Loja */}
            <div className="relative" ref={storeSelectorRef}>
              <button
                onClick={() => setStoreSelectorOpen((prev) => !prev)}
                className={`hover:text-[var(--accent-primary)] transition-colors py-1 flex items-center gap-1.5 ${
                  pathname === '/lojas' ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'
                }`}
              >
                <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>{selectedStore?.neighborhood ? `Loja ${selectedStore.neighborhood}` : 'Lojas Luanda'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              <AnimatePresence>
                {storeSelectorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-xl p-2 z-50"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] px-3 py-1.5">
                      Selecione a Unidade
                    </div>
                    <div className="space-y-1">
                      {availableStores.map((store) => (
                        <button
                          key={store.id}
                          onClick={() => {
                            setSelectedStore(store as any);
                            setStoreSelectorOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            selectedStore?.neighborhood === store.neighborhood
                              ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold'
                              : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{store.neighborhood}</div>
                            <div className="text-[10px] text-[var(--text-secondary)]">{store.name}</div>
                          </div>
                          <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-md font-bold">
                            {store.status}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-[var(--border-color)] mt-2 pt-2 px-1">
                      <Link
                        href="/lojas"
                        onClick={() => setStoreSelectorOpen(false)}
                        className="w-full text-center text-xs text-[var(--accent-primary)] font-bold hover:underline block py-1"
                      >
                        Ver todas as lojas no mapa
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Lado Direito: Ações Rápidas, Favoritos, Notificações e Perfil */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Botão de Pesquisa Rápida */}
            <button
              id="top-nav-search-button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Pesquisar hambúrgueres"
              className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl transition-colors hidden sm:flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Ativador do Modo Faminto */}
            <button
              onClick={() => setFamintoMode(true)}
              title="Ativar Modo Faminto Extremo"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              Modo Faminto
            </button>

            {/* Notificações Firebase Realtime (Com Painel Dropdown & Dot Numérico) */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setNotificationsOpen((prev) => !prev);
                  if (!notificationsOpen) {
                    markAllNotificationsRead();
                  }
                }}
                aria-label="Notificações"
                className={`p-2 rounded-xl transition-colors relative flex items-center justify-center ${
                  pathname === '/notificacoes' || notificationsOpen
                    ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-md animate-pulse">
                    {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="fixed left-1/2 top-[80px] -translate-x-1/2 w-[calc(100vw-32px)] max-w-md bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-4 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span className="font-bold text-sm">Notificações</span>
                      </div>
                      <span className="text-[10px] bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full font-semibold">
                        {notifications.length} total
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-2.5 rounded-xl text-xs transition-colors border ${
                              !notif.read
                                ? 'bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/20'
                                : 'bg-[var(--bg-secondary)]/50 border-transparent'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-[var(--text-primary)] mb-1">
                              <span>{notif.title}</span>
                              <span className="text-[9px] text-[var(--text-secondary)] font-normal">
                                {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Agora'}
                              </span>
                            </div>
                            <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-[var(--text-secondary)]">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">Sem notificações de momento</p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[var(--border-color)] mt-3 pt-2 text-center">
                      <Link
                        href="/notificacoes"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-[var(--accent-primary)] font-bold hover:underline block py-1"
                      >
                        Ver todas as notificações
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu Dropdown do Utilizador / Autenticação */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                aria-label="Meu Perfil e Conta"
                className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition-all flex items-center gap-2 border ${
                  pathname === '/perfil' || userDropdownOpen
                    ? 'bg-[var(--bg-secondary)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                    : 'border-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                }`}
              >
                {user ? (
                  <>
                    <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-[var(--accent-primary)] shrink-0">
                      <Image
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                        alt={user.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="hidden xl:flex flex-col text-left">
                      <span className="text-xs font-bold leading-tight truncate max-w-[100px]">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-yellow-500 font-semibold">{user.points} pts</span>
                    </div>
                  </>
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-2 z-50"
                  >
                    {user ? (
                      <>
                        <div className="p-2.5 border-b border-[var(--border-color)] mb-1">
                          <p className="text-xs font-bold truncate text-[var(--text-primary)]">{user.name}</p>
                          <p className="text-[10px] text-[var(--text-secondary)] truncate">{user.email}</p>
                          <div className="mt-2 flex items-center justify-between text-[10px] bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg text-yellow-500 font-bold">
                            <span>Pontos Famintos</span>
                            <span>{user.points} pts</span>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <Link
                            href="/perfil"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span>Meu Perfil</span>
                          </Link>

                          <Link
                            href="/pedidos"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                          >
                            <Package className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span>Meus Pedidos</span>
                          </Link>

                          <Link
                            href="/rewards"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                          >
                            <Gift className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span>Recompensas</span>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="p-2 space-y-2">
                        <p className="text-xs text-[var(--text-secondary)] text-center mb-1">
                          Aceda à sua conta para acumular pontos.
                        </p>
                        <Link href="/entrar" onClick={() => setUserDropdownOpen(false)}>
                          <Button className="w-full font-bold uppercase text-xs tracking-wider">
                            Entrar
                          </Button>
                        </Link>
                        <Link href="/registar" onClick={() => setUserDropdownOpen(false)}>
                          <Button variant="outline" className="w-full font-bold uppercase text-xs tracking-wider">
                            Criar Conta
                          </Button>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa Expansível para Mobile/Desktop */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3"
            >
              <div className="container mx-auto max-w-3xl flex items-center gap-3">
                <Search className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisa hambúrgueres, combos, batatas, bebidas..."
                  className="w-full bg-transparent border-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/menu?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                />
                {searchQuery && (
                  <Link
                    href={`/menu?search=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setSearchOpen(false)}
                  >
                    <Button size="sm" className="text-xs uppercase font-bold tracking-wider">
                      Ver no Menu
                    </Button>
                  </Link>
                )}
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 text-[var(--text-secondary)] hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Menu Lateral Deslizante (Drawer Mobile) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Fundo Escuro com Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            />

            {/* Conteúdo do Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-sm bg-[var(--bg-primary)] border-r border-[var(--border-color)] shadow-2xl flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              {/* Cabeçalho do Drawer Mobile */}
              <div className="p-5 border-b border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-4">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                    <span className="font-display font-bold text-2xl tracking-tighter">
                      BURGUER<span className="text-[var(--accent-primary)]">FAMINTO</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Badge de Funcionamento em Tempo Real */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 w-max shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Aberto agora para Delivery
                  </span>
                </div>

                {/* Seletor Rápido de Unidade Mobile */}
                <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-2 rounded-xl border border-[var(--border-color)]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <span>Unidade: <strong>{selectedStore?.neighborhood || 'Luanda'}</strong></span>
                  </span>
                  <Link
                    href="/lojas"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[var(--accent-primary)] font-bold hover:underline"
                  >
                    Mudar
                  </Link>
                </div>
              </div>

              {/* Links Principais do Menu Mobile - Navegação Bottom Integrada */}
              <div className="p-5 space-y-1 flex-1">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] px-3 mb-2">
                  Navegação Principal
                </div>

                {navItems.map((item) => {
                  const isActive = !item.isCart && pathname === item.href;
                  const Icon = item.icon;

                  if (item.isCart) {
                    return (
                      <button
                        key="bottom-cart-btn"
                        onClick={() => {
                          setCartOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors font-medium text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      >
                        <span className="flex items-center gap-3">
                          <ShoppingBag className="w-5 h-5" />
                          <span>Carrinho</span>
                        </span>
                        {totalItems > 0 && (
                          <span className="text-[10px] bg-[var(--accent-primary)] text-white px-2 py-0.5 rounded-full font-bold">
                            {totalItems} itens
                          </span>
                        )}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href!}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
                        isActive
                          ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  );
                })}

                {/* Divisória */}
                <div className="pt-2 mt-2 border-t border-[var(--border-color)]">
                  <Link
                    href="/promocoes"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
                      pathname === '/promocoes'
                        ? 'bg-orange-500/10 text-orange-500 font-bold'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <span className="flex items-center gap-3">🔥 Promoções & Combos</span>
                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                      Ofertas
                    </span>
                  </Link>

                  <Link
                    href="/favoritos"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
                      pathname === '/favoritos'
                        ? 'bg-rose-500/10 text-rose-500 font-bold'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <span>Os Meus Favoritos</span>
                    </span>
                    {favorites.length > 0 && (
                      <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                </div>

                <Link
                  href="/notificacoes"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    markAllNotificationsRead();
                  }}
                  className={`flex items-center justify-between px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
                    pathname === '/notificacoes'
                      ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Notificações</span>
                  </span>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                      {unreadNotificationsCount} novas
                    </span>
                  )}
                </Link>

                <Link
                  href="/rewards"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
                    pathname === '/rewards'
                      ? 'bg-yellow-500/10 text-yellow-500 font-bold'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  <span className="flex items-center gap-3">🏆 Faminto Rewards</span>
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full font-bold">
                    Pontos
                  </span>
                </Link>

                {/* Seção Extra do Menu Drawer */}
                <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] px-3 mb-2">
                    Mais Opções
                  </div>

                  <button
                    onClick={() => {
                      setFamintoMode(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Ativar Modo Faminto</span>
                    </span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Rodapé do Drawer Mobile - Perfil do Utilizador */}
              <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                {user ? (
                  <Link
                    href="/perfil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[var(--accent-primary)] shrink-0">
                      <Image
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                        alt={user.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-sm font-bold truncate">{user.name}</div>
                      <div className="text-xs text-yellow-500 font-semibold">{user.points} Pontos Famintos</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                  </Link>
                ) : (
                  <Link href="/entrar" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full font-bold uppercase text-xs tracking-wider">
                      Entrar na Conta
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
