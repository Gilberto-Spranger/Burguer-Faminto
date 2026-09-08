'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  User as UserIcon,
  Package,
  Heart,
  Award,
  Ticket,
  MapPin,
  Settings,
  LogOut,
  Repeat,
  Copy,
  Check,
  Plus,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  Camera,
  Save,
  CheckCircle2,
  Flame,
  UserCheck,
  Bell,
  Upload,
} from 'lucide-react';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Coupon, Order, UserAddress } from '@/types';

type ProfileTab =
  | 'dados'
  | 'pedidos'
  | 'enderecos'
  | 'fidelidade'
  | 'cupons'
  | 'favoritos'
  | 'definicoes';

const AVAILABLE_AVATARS = [
  '/avatars/old.jpg',
  '/avatars/kid.jpg',
  '/avatars/young.jpg',
  '/avatars/shy.jpg',
  '/avatars/beauty.jpg',
  '/avatars/smart.jpg',
];

const LUANDA_NEIGHBORHOODS = [
  'Talatona',
  'Maianga',
  'Kilamba',
  'Alvalade',
  'Miramar',
  'Ilha do Cabo',
  'Morro Bento',
  'Patriota',
  'Benfica',
  'Maculusso',
  'Nova Vida',
];

const DIETARY_OPTIONS = [
  'Sem cebola crua',
  'Molho barbecue extra',
  'Carne bem passada',
  'Pão brioche tostado',
  'Extra queijo cheddar',
  'Bacon crocante',
  'Sem picles',
  'Pão sem sementes',
  'Burger no prato (sem pão)',
];

export default function PerfilPage() {
  const {
    user,
    logout,
    orders,
    favorites,
    products,
    toggleFavorite,
    addToCart,
    setCartOpen,
    updateUserProfile,
    isPushEnabled,
    requestPushPermission,
    sendTestPush,
  } = useStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>('dados');
  const [isActivatingPush, setIsActivatingPush] = useState(false);
  const [pushStatusMsg, setPushStatusMsg] = useState<string | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addresses, setAddresses] = useState<UserAddress[]>(
    user?.addresses || []
  );

  const [newLabel, setNewLabel] = useState('Casa');
  const [newAddressText, setNewAddressText] = useState('');
  const [newRefText, setNewRefText] = useState('');

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [phoneSecondary, setPhoneSecondary] = useState(user?.phoneSecondary || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '1998-05-14');
  const [gender, setGender] = useState(user?.gender || 'Masculino');
  const [neighborhood, setNeighborhood] = useState(user?.preferredNeighborhood || 'Talatona');
  const [bio, setBio] = useState(user?.bio || '');
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(user?.dietaryPreferences || []);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVAILABLE_AVATARS[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'open' | 'completed'>('all');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setPhoneSecondary(user.phoneSecondary || '');
      setBirthDate(user.birthDate || '1998-05-14');
      setGender(user.gender || 'Masculino');
      setNeighborhood(user.preferredNeighborhood || 'Talatona');
      setBio(user.bio || '');
      setDietaryPrefs(user.dietaryPreferences || []);
      setSelectedAvatar(user.avatar || AVAILABLE_AVATARS[0]);
      setAddresses(user.addresses || []);
    }
  }, [user]);

  useEffect(() => {
    fetch('/api/coupons')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCoupons(data);
        }
      })
      .catch(() => {});
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mx-auto border border-[var(--accent-primary)]/20">
            <UserIcon className="w-10 h-10" />
          </div>

          <div>
            <h2 className="font-display font-bold text-3xl uppercase tracking-tight">
              Área do Faminto
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
              Inicia sessão para veres os teus dados de perfil, pedidos em tempo real, endereços e pontos de fidelidade.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/entrar" className="w-full">
              <Button className="w-full py-3.5 rounded-xl font-display font-bold uppercase tracking-wider bg-[var(--accent-primary)] hover:opacity-90 transition-all text-white shadow-lg">
                Iniciar Sessão
              </Button>
            </Link>

            <Link href="/registo" className="w-full">
              <Button variant="outline" className="w-full py-3.5 rounded-xl font-display font-bold uppercase tracking-wider">
                Criar Nova Conta
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full py-2.5 rounded-xl text-xs uppercase font-bold text-[var(--text-secondary)] hover:text-white">
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const favoriteProducts = products.filter((product) => favorites.includes(product.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    updateUserProfile({
      name,
      email,
      phone,
      phoneSecondary,
      birthDate,
      gender,
      preferredNeighborhood: neighborhood,
      bio,
      dietaryPreferences: dietaryPrefs,
      avatar: selectedAvatar,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleToggleDietary = (pref: string) => {
    setDietaryPrefs((current) =>
      current.includes(pref) ? current.filter((item) => item !== pref) : [...current, pref]
    );
  };

  const handleCopyCoupon = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCoupon(code);
      setTimeout(() => {
        setCopiedCoupon(null);
      }, 2500);
    } catch {
      setPushStatusMsg('Não foi possível copiar o código.');
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity, item.extras, item.customizations);
    });
    setCartOpen(true);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;

    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      address: newAddressText,
      reference: newRefText,
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, newAddr];
    setAddresses(updated);
    updateUserProfile({ addresses: updated });
    setNewAddressText('');
    setNewRefText('');
    setShowAddAddressModal(false);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((address) => address.id !== id);
    setAddresses(updated);
    updateUserProfile({ addresses: updated });
  };

  const handleActivatePush = async () => {
    setIsActivatingPush(true);
    setPushStatusMsg(null);

    try {
      await requestPushPermission();
      setPushStatusMsg('Pedido de ativação das notificações enviado. Verifica a permissão do navegador.');
    } catch {
      setPushStatusMsg('Não foi possível ativar as notificações neste momento.');
    } finally {
      setIsActivatingPush(false);
    }
  };

  const handleTestPush = () => {
    try {
      sendTestPush();
      setPushStatusMsg('Alerta de notificação de teste disparado!');
    } catch {
      setPushStatusMsg('Não foi possível disparar a notificação de teste.');
    }
  };

  const handleAvatarFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.url) {
        setSelectedAvatar(result.url);
        updateUserProfile({ avatar: result.url });
        setShowAvatarPicker(false);
      } else {
        alert(result.error || 'Erro ao carregar fotografia.');
      }
    } catch {
      alert('Erro de conexão ao carregar fotografia.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const progressPercentage = Math.min(
    100,
    Math.round((user.points / (user.nextLevelPoints || 2000)) * 100)
  );

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === 'open') {
      return order.status !== 'Entregue' && order.status !== 'Cancelado';
    }
    if (orderFilter === 'completed') {
      return order.status === 'Entregue';
    }
    return true;
  });

  const openOrdersCount = orders.filter(
    (order) => order.status !== 'Entregue' && order.status !== 'Cancelado'
  ).length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
              <div className="relative group shrink-0">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-[var(--accent-primary)] bg-black shadow-xl">
                  <Image
                    src={selectedAvatar || user.avatar || AVAILABLE_AVATARS[0]}
                    alt={user.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center p-1 bg-black rounded-full shadow-md">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(true)}
                  title="Mudar Foto de Perfil"
                  className="absolute bottom-1 right-1 p-2 bg-[var(--accent-primary)] hover:opacity-90 text-white rounded-xl shadow-lg transition-transform active:scale-90"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[var(--accent-primary)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <Award className="w-3.5 h-3.5" />
                    {user.level}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Conta Verificada
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>Ativo em Luanda</span>
                  </span>
                </div>

                <h1 className="font-display font-bold text-2xl sm:text-4xl uppercase tracking-tight truncate">
                  {name || user.name}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
                  {email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      {email}
                    </span>
                  )}
                  {phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      {phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    {neighborhood}, Luanda
                  </span>
                </div>

                {bio && (
                  <p className="text-xs text-[var(--text-secondary)] italic max-w-xl line-clamp-2 pt-0.5">
                    &ldquo;{bio}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="w-full lg:w-96 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                    Faminto Points
                  </span>
                  <span className="font-display font-bold text-2xl text-[var(--accent-primary)]">
                    {user.points.toLocaleString()} pts
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                    Pedidos Feitos
                  </span>
                  <span className="font-display font-bold text-2xl text-white">
                    {orders.length}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] font-bold uppercase">
                  <span>{user.level}</span>
                  <span>Faltam {user.pointsToNextLevel || 650} pts</span>
                </div>

                <div className="w-full bg-[var(--bg-secondary)] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[var(--accent-primary)] to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 sticky top-16 z-20 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex overflow-x-auto hide-scrollbar gap-1 py-2">
            {[
              { id: 'dados', label: 'Dados do Perfil', icon: UserCheck },
              { id: 'pedidos', label: 'Meus Pedidos', icon: Package, count: orders.length, hasOpen: openOrdersCount > 0 },
              { id: 'enderecos', label: 'Endereços', icon: MapPin, count: addresses.length },
              { id: 'fidelidade', label: 'Rewards & Nível', icon: Award },
              { id: 'cupons', label: 'Cupons', icon: Ticket, count: coupons.length },
              { id: 'favoritos', label: 'Favoritos', icon: Heart, count: favorites.length },
              { id: 'definicoes', label: 'Definições', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ProfileTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-[var(--accent-primary)] text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-primary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>

                  {tab.hasOpen && (
                    <span className="relative flex h-2 w-2 ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}

                  {tab.count !== undefined && !tab.hasOpen && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-black/30 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {activeTab === 'dados' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight">
                  Informações Pessoais do Perfil
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                  Gere os teus dados de contacto, preferências gastronómicas e localização em Luanda.
                </p>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dados guardados com sucesso!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                  <h3 className="font-display font-bold text-xl uppercase tracking-wide flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                    Identificação & Contacto
                  </h3>
                  <span className="text-xs text-[var(--text-secondary)]">
                    Campos protegidos por encriptação
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1.5">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                      placeholder="Ex: Teu Nome"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1.5 flex items-center justify-between">
                      <span>E-mail de Notificação *</span>
                      <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verificado
                      </span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                      placeholder="teu.email@exemplo.com"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1.5">
                      Telemóvel Principal (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                      placeholder="+244 923 000 111"
                    />
                    <span className="text-[10px] text-[var(--text-secondary)] mt-1 block">
                      Usado para envio das notificações de entrega do estafeta.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1.5">
                      Telemóvel Secundário (Opcional)
                    </label>
                    <input
                      type="tel"
                      value={phoneSecondary}
                      onChange={(e) => setPhoneSecondary(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                      placeholder="+244 912 334 455"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1.5 flex items-center justify-between">
                      <span>Data de Nascimento</span>
                      <span className="text-[var(--accent-primary)] text-[10px] font-bold">
                        🎂 Ganha 1 Burger no Aniversário
                      </span>
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1.5">
                      Bairro Habitual em Luanda
                    </label>
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                    >
                      {LUANDA_NEIGHBORHOODS.map((nh) => (
                        <option key={nh} value={nh}>
                          {nh}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1.5">
                      Género
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {['Masculino', 'Feminino', 'Prefiro não indicar'].map((g) => (
                        <label key={g} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={gender === g}
                            onChange={() => setGender(g)}
                            className="accent-[var(--accent-primary)]"
                          />
                          <span>{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1.5">
                      Bio / Frase de Apresentação Faminta
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Escreve uma frase sobre o teu apetite ou o teu hambúrguer de eleição..."
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                  <h3 className="font-display font-bold text-xl uppercase tracking-wide flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Preferências do Burger Padrão
                  </h3>
                  <span className="text-xs text-[var(--text-secondary)]">
                    Aplicado como sugestão ao pedir
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)]">
                  Clica para selecionar os teus hábitos de consumo para pré-personalizarmos os teus pedidos:
                </p>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  {DIETARY_OPTIONS.map((option) => {
                    const isSelected = dietaryPrefs.includes(option);
                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => handleToggleDietary(option)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                          isSelected
                            ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-md'
                            : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
                {saveSuccess && (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Alterações salvas com sucesso no teu perfil!
                  </span>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-display font-bold uppercase tracking-wider bg-[var(--accent-primary)] hover:opacity-90 transition-all text-white shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar Dados do Perfil
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'pedidos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight">
                  Histórico de Pedidos
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                  Acompanha em tempo real o estado de cada hambúrguer feito para ti.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    orderFilter === 'all'
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  Todos ({orders.length})
                </button>

                <button
                  type="button"
                  onClick={() => setOrderFilter('open')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                    orderFilter === 'open'
                      ? 'bg-emerald-600 text-white'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>Em Aberto ({openOrdersCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    orderFilter === 'completed'
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  Concluídos
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-6">
                <Package className="w-16 h-16 mx-auto mb-3 opacity-30 text-[var(--text-secondary)]" />
                <h3 className="font-display text-xl uppercase mb-1">
                  Nenhum pedido encontrado neste filtro
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  O teu estômago está a reclamar? Explora o menu e faz já o teu pedido.
                </p>
                <Link href="/menu">
                  <Button className="rounded-xl uppercase font-bold text-xs tracking-wider">
                    Fazer Pedido Agora
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isOpen = order.status !== 'Entregue' && order.status !== 'Cancelado';

                  return (
                    <div
                      key={order.id}
                      className={`bg-[var(--bg-secondary)] border rounded-3xl p-6 transition-all ${
                        isOpen
                          ? 'border-emerald-500/50 shadow-lg ring-1 ring-emerald-500/20'
                          : 'border-[var(--border-color)] hover:border-[var(--accent-primary)]/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-1.5">
                            <span className="font-display font-bold text-xl text-[var(--accent-primary)]">
                              {order.orderNumber}
                            </span>

                            {isOpen ? (
                              <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 shadow-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                </span>
                                <span>Em Aberto • {order.status}</span>
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">
                                ✓ {order.status}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[var(--text-secondary)]">
                            Método:{' '}
                            <strong className="text-[var(--text-primary)]">
                              {order.paymentMethod}
                            </strong>{' '}
                            •{' '}
                            {new Date(order.createdAt).toLocaleDateString('pt-AO', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-left sm:text-right">
                            <span className="text-xs text-[var(--text-secondary)] block">
                              Total Pago
                            </span>
                            <span className="font-display font-bold text-2xl text-[var(--accent-primary)]">
                              {order.total.toLocaleString('pt-AO')} Kz
                            </span>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleReorder(order)}
                            className="font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 bg-[var(--accent-primary)] text-white shadow-md hover:opacity-90"
                          >
                            <Repeat className="w-3.5 h-3.5" />
                            Pedir de Novo
                          </Button>
                        </div>
                      </div>

                      <div className="py-4 space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm py-1">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-xs bg-[var(--bg-primary)] w-6 h-6 rounded-lg flex items-center justify-center border border-[var(--border-color)]">
                                {item.quantity}x
                              </span>
                              <div>
                                <span className="font-medium text-[var(--text-primary)]">
                                  {item.product.name}
                                </span>
                                {item.extras && item.extras.length > 0 && (
                                  <span className="text-xs text-[var(--text-secondary)] block">
                                    + {item.extras.map((extra) => extra.name).join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>

                            <span className="font-medium text-xs text-[var(--text-secondary)]">
                              {item.totalPrice.toLocaleString('pt-AO')} Kz
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.deliveryAddress && (
                        <div className="bg-[var(--bg-primary)] p-3 rounded-2xl border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--text-secondary)] gap-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                            <span>
                              Entrega em:{' '}
                              <strong>{order.deliveryAddress.address}</strong>
                              {order.deliveryAddress.reference && ` (Ref: ${order.deliveryAddress.reference})`}
                            </span>
                          </div>

                          {isOpen && (
                            <div className="flex items-center gap-2 text-emerald-400 font-bold">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                              </span>
                              <span>Estafeta a Caminho</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'enderecos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl uppercase">
                  Moradas de Entrega em Luanda
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Guarda os teus endereços habituais para um checkout super rápido.
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setShowAddAddressModal(true)}
                className="font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Novo Endereço
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-base uppercase">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-bold px-2 py-0.5 rounded">
                          Principal
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[var(--text-primary)]">
                      {addr.address}
                    </p>

                    {addr.reference && (
                      <p className="text-xs text-[var(--text-secondary)]">
                        Ref: {addr.reference}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                    title="Remover endereço"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {addresses.length === 0 && (
                <div className="md:col-span-2 text-center py-12 rounded-2xl border border-dashed border-[var(--border-color)]">
                  <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-bold">Nenhum endereço guardado</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Adiciona uma morada para acelerar o checkout.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'fidelidade' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[var(--accent-primary)]/20 via-[var(--bg-secondary)] to-[var(--bg-secondary)] border border-[var(--accent-primary)]/40 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] block mb-1">
                    Programa de Fidelidade Oficial
                  </span>
                  <h2 className="font-display font-bold text-3xl uppercase">
                    Faminto Rewards
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
                    Ganha 10 pontos por cada 100 Kz gastos. Troca pontos por hambúrgueres grátis, combos e sobremesas exclusivas!
                  </p>
                </div>

                <div className="text-center sm:text-right bg-black/40 p-4 rounded-2xl border border-[var(--border-color)]">
                  <span className="text-xs text-[var(--text-secondary)] uppercase block">
                    O Teu Saldo
                  </span>
                  <span className="font-display font-bold text-3xl text-[var(--accent-primary)]">
                    {user.points.toLocaleString()}
                  </span>
                  <span className="text-xs text-white block mt-0.5">
                    Pontos Disponíveis
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl uppercase mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[var(--accent-primary)]" />
                Insígnias Conquistadas
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                      badge.isUnlocked
                        ? 'bg-[var(--bg-secondary)] border-[var(--accent-primary)]/50 shadow-md'
                        : 'bg-[var(--bg-secondary)]/40 border-[var(--border-color)] opacity-40'
                    }`}
                  >
                    <span className="text-3xl p-2 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]">
                      {badge.icon}
                    </span>

                    <div>
                      <h4 className="font-display font-bold text-base uppercase">
                        {badge.name}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {badge.description}
                      </p>
                      {badge.isUnlocked && badge.unlockedAt && (
                        <span className="text-[10px] text-emerald-400 font-bold block mt-2">
                          ✓ Desbloqueada em {badge.unlockedAt}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-2xl uppercase">
                Meus Cupons de Desconto
              </h2>
              <span className="text-xs text-[var(--text-secondary)]">
                {coupons.length} disponíveis
              </span>
            </div>

            {coupons.length === 0 ? (
              <div className="text-center py-16 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                <Ticket className="w-16 h-16 mx-auto mb-3 opacity-30 text-[var(--accent-primary)]" />
                <h3 className="font-display text-xl uppercase mb-1">
                  Nenhum cupom ativo no momento
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Fica atento aos nossos comunicados e notificações para receber cupons exclusivos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                          {coupon.discountType === 'percent'
                            ? `${coupon.discountValue}% OFF`
                            : `-${coupon.discountValue} Kz`}
                        </span>

                        {coupon.expiresAt && (
                          <span className="text-[11px] text-[var(--text-secondary)]">
                            Válido até {coupon.expiresAt}
                          </span>
                        )}
                      </div>

                      <div className="bg-[var(--bg-primary)] border border-dashed border-[var(--border-color)] rounded-xl p-3 text-center my-3">
                        <span className="font-display font-bold text-xl tracking-widest text-white">
                          {coupon.code}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] mb-4">
                        {coupon.description}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleCopyCoupon(coupon.code)}
                      className="w-full text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"
                    >
                      {copiedCoupon === coupon.code ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiar Código
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favoritos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-2xl uppercase">
                Meus Favoritos
              </h2>
              <span className="text-xs text-[var(--text-secondary)]">
                {favoriteProducts.length} guardados
              </span>
            </div>

            {favoriteProducts.length === 0 ? (
              <div className="text-center py-16 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
                <Heart className="w-16 h-16 mx-auto mb-3 opacity-30 text-[var(--accent-primary)]" />
                <h3 className="font-display text-xl uppercase mb-1">
                  A tua lista está vazia
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  Clica no coração de qualquer produto no menu para adicionares aos teus favoritos.
                </p>
                <Link href="/menu">
                  <Button className="rounded-xl uppercase text-xs font-bold">
                    Explorar Menu
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[var(--accent-primary)] transition-all flex flex-col"
                  >
                    <div className="relative h-48 w-full bg-[var(--bg-primary)]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />

                      <button
                        type="button"
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full text-[var(--accent-primary)] hover:scale-110 transition-transform"
                      >
                        <Heart className="w-4 h-4 fill-[var(--accent-primary)]" />
                      </button>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-display font-bold text-base uppercase mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4 flex-1">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                        <span className="font-display font-bold text-base text-[var(--accent-primary)]">
                          {(product.promotionalPrice || product.price).toLocaleString('pt-AO')} Kz
                        </span>

                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          className="font-bold text-xs uppercase rounded-xl"
                        >
                          Pedir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'definicoes' && (
          <div className="max-w-2xl space-y-6">
            <h2 className="font-display font-bold text-2xl uppercase">
              Definições da Conta
            </h2>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl divide-y divide-[var(--border-color)]">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Bell className="w-4 h-4 text-[var(--accent-primary)]" />
                    <h4 className="font-bold text-sm">
                      Notificações Push
                    </h4>
                    {isPushEnabled ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Ativo ✓
                      </span>
                    ) : (
                      <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                        Inativo
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--text-secondary)]">
                    Recebe alertas em tempo real no ecrã quando o teu pedido sair da grelha ou o estafeta estiver a caminho em Luanda.
                  </p>

                  {pushStatusMsg && (
                    <p className="text-xs text-emerald-400 font-medium">
                      {pushStatusMsg}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isPushEnabled ? (
                    <Button
                      size="sm"
                      disabled={isActivatingPush}
                      onClick={handleActivatePush}
                      className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white font-bold text-xs uppercase rounded-xl shadow-md"
                    >
                      {isActivatingPush ? 'A Ativar...' : 'Ativar Push'}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestPush}
                      className="border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold text-xs uppercase rounded-xl"
                    >
                      Testar Alerta
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">
                    Notificações de Pedido via WhatsApp
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Receber alertas em tempo real do estado do burger no teu telemóvel (+244)
                  </p>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 accent-[var(--accent-primary)]"
                />
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">
                    SMS de Promoções Exclusivas
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Receber alertas quando saem novos combos com até 30% de desconto
                  </p>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 accent-[var(--accent-primary)]"
                />
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">
                    Pagamento Padrão
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    AppyPay Angola (Multicaixa Express pré-configurado)
                  </p>
                </div>

                <span className="text-xs text-emerald-400 font-bold">
                  Ativo ✓
                </span>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-red-400">
                    Terminar Sessão
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Desconectar esta conta deste navegador
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold text-xs uppercase rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 max-w-md w-full space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl uppercase">
                Escolhe a tua Foto de Perfil
              </h3>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(false)}
                className="text-[var(--text-secondary)] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 border border-dashed border-[var(--border-color)] rounded-2xl text-center space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarFileUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-xs font-bold uppercase rounded-xl gap-2"
              >
                <Upload className="w-4 h-4" />
                {isUploadingAvatar ? 'A carregar ficheiro...' : 'Carregar Minha Própria Imagem'}
              </Button>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Formatos suportados: PNG, JPG ou WEBP (máx 5MB)
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {AVAILABLE_AVATARS.map((avatarUrl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSelectedAvatar(avatarUrl);
                    updateUserProfile({ avatar: avatarUrl });
                    setShowAvatarPicker(false);
                  }}
                  className={`relative h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedAvatar === avatarUrl
                      ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)] scale-105'
                      : 'border-[var(--border-color)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  <Image
                    src={avatarUrl}
                    alt="Avatar option"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setShowAvatarPicker(false)}
              className="w-full rounded-xl uppercase font-bold text-xs"
            >
              Fechar
            </Button>
          </div>
        </div>
      )}

      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-display font-bold text-xl uppercase">
              Novo Endereço em Luanda
            </h3>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1">
                  Etiqueta
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-2.5 text-sm"
                  placeholder="Casa, Trabalho..."
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1">
                  Endereço Completo em Luanda
                </label>
                <input
                  type="text"
                  placeholder="ex: Rua Amílcar Cabral, Condomínio Luanda Sul..."
                  value={newAddressText}
                  onChange={(e) => setNewAddressText(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-2.5 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[var(--text-secondary)] block mb-1">
                  Ponto de Referência
                </label>
                <input
                  type="text"
                  placeholder="ex: Próximo à bomba da Sonangol, portão azul..."
                  value={newRefText}
                  onChange={(e) => setNewRefText(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-2.5 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 rounded-xl"
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  className="flex-1 rounded-xl font-bold uppercase"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
