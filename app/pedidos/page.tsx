'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  ChefHat,
  XCircle,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  MapPin,
  CreditCard,
  Package,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Order, OrderStatus } from '@/types';

export default function PedidosPage() {
  const { orders, user, loadUserOrders, addToCart } = useStore();
  const [filter, setFilter] = useState<'todos' | 'ativos' | 'concluidos'>('todos');

  useEffect(() => {
    if (user?.id) {
      loadUserOrders(user.id);
    }
  }, [user?.id, loadUserOrders]);

  // Mapeamento dos estados do pedido para progresso e ícone
  const getStatusDetails = (status: OrderStatus) => {
    switch (status) {
      case 'Pendente':
        return {
          step: 1,
          progress: 15,
          color: 'bg-amber-500',
          textColor: 'text-amber-500',
          badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
          icon: Clock,
          label: 'A aguardar confirmação',
        };
      case 'Processando':
      case 'Preparação':
        return {
          step: 2,
          progress: 45,
          color: 'bg-orange-500',
          textColor: 'text-orange-500',
          badgeBg: 'bg-orange-500/10 border-orange-500/20 text-orange-500',
          icon: ChefHat,
          label: 'A preparar o hambúrguer',
        };
      case 'Pronto':
      case 'A caminho':
        return {
          step: 3,
          progress: 80,
          color: 'bg-blue-500',
          textColor: 'text-blue-500',
          badgeBg: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
          icon: Truck,
          label: 'Estafeta a caminho',
        };
      case 'Entregue':
        return {
          step: 4,
          progress: 100,
          color: 'bg-emerald-500',
          textColor: 'text-emerald-500',
          badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
          icon: CheckCircle2,
          label: 'Entregue com sucesso',
        };
      case 'Cancelado':
        return {
          step: 0,
          progress: 0,
          color: 'bg-rose-500',
          textColor: 'text-rose-500',
          badgeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
          icon: XCircle,
          label: 'Pedido cancelado',
        };
      default:
        return {
          step: 1,
          progress: 10,
          color: 'bg-amber-500',
          textColor: 'text-amber-500',
          badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
          icon: Clock,
          label: status,
        };
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'ativos') {
      return ['Pendente', 'Processando', 'Preparação', 'Pronto', 'A caminho'].includes(order.status);
    }
    if (filter === 'concluidos') {
      return ['Entregue', 'Cancelado'].includes(order.status);
    }
    return true;
  });

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity, item.extras, item.customizations);
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] pb-24 pt-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--border-color)]/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-muted)]" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Os Meus Pedidos</h1>
            <p className="text-sm text-[var(--text-muted)]">Acompanha e revê as tuas refeições no Burguer Faminto</p>
          </div>
        </div>
      </div>

      {/* Filtros de Estado */}
      <div className="flex items-center gap-2 mb-8 border-b border-[var(--border-color)] pb-4 overflow-x-auto no-scrollbar">
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'ativos', label: 'Em Andamento' },
          { key: 'concluidos', label: 'Concluídos' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              filter === tab.key
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-color)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista de Pedidos */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 text-amber-500">
            <Package className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">Sem pedidos encontrados</h3>
          <p className="text-[var(--text-muted)] max-w-sm mb-6">
            Ainda não fizeste nenhum pedido com este filtro. Que tal saborear um hambúrguer hoje?
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-2xl transition-colors shadow-lg shadow-amber-500/20"
          >
            Explorar Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusDetails(order.status);
            const StatusIcon = statusInfo.icon;
            const isActive = ['Pendente', 'Processando', 'Preparação', 'Pronto', 'A caminho'].includes(order.status);

            return (
              <div
                key={order.id}
                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-5 sm:p-6 shadow-sm hover:border-amber-500/30 transition-all"
              >
                {/* Topo do Card: Nº do Pedido + Estado */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-lg text-amber-500">#{order.orderNumber}</span>
                      <span className="text-xs text-[var(--text-muted)]">
                        • {new Date(order.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                    </p>
                  </div>

                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${statusInfo.badgeBg}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span>{order.status}</span>
                  </div>
                </div>

                {/* Barra de Progresso (Se o pedido estiver ativo) */}
                {isActive && (
                  <div className="mb-6 bg-[var(--bg-color)] p-4 rounded-2xl border border-[var(--border-color)]">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className={statusInfo.textColor}>{statusInfo.label}</span>
                      <span className="text-[var(--text-muted)]">{statusInfo.progress}%</span>
                    </div>
                    <div className="w-full bg-[var(--border-color)] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${statusInfo.color} transition-all duration-500 ease-out`}
                        style={{ width: `${statusInfo.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Resumo de Itens do Pedido */}
                <div className="space-y-3 mb-5">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-500 font-bold text-xs flex items-center justify-center shrink-0">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          {item.extras && item.extras.length > 0 && (
                            <p className="text-xs text-[var(--text-muted)]">
                              + {item.extras.map((e) => e.name).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-semibold shrink-0">
                        {item.totalPrice.toLocaleString('pt-AO')} Kz
                      </span>
                    </div>
                  ))}
                </div>

                {/* Detalhes de Endereço e Pagamento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[var(--bg-color)]/50 rounded-2xl border border-[var(--border-color)]/60 text-xs text-[var(--text-muted)] mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">{order.deliveryAddress.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Rodapé do Card: Total e Ações */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                  <div>
                    <span className="text-xs text-[var(--text-muted)] block">Total Pago</span>
                    <span className="text-lg font-black text-amber-500">
                      {order.total.toLocaleString('pt-AO')} Kz
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black font-bold text-xs rounded-xl transition-all border border-amber-500/20"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Repetir</span>
                    </button>

                    <Link
                      href={`/pedidos/${order.id}`}
                      className="flex items-center gap-1 px-4 py-2 bg-[var(--bg-color)] hover:bg-[var(--border-color)]/40 font-bold text-xs rounded-xl transition-all border border-[var(--border-color)]"
                    >
                      <span>Detalhes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
