'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  Flame,
  ShoppingBag,
  Award,
  Sparkles,
  Info,
  ChevronRight,
  ArrowLeft,
  Clock,
  Inbox,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { NotificationItem } from '@/types';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useStore();

  const [filter, setFilter] = useState<'all' | 'unread' | 'promo' | 'order'>('all');

  const filteredNotifications = notifications.filter((notification: NotificationItem) => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'promo') return notification.type === 'promo';
    if (filter === 'order') return notification.type === 'order';
    return true;
  });

  const unreadCount = notifications.filter((n: NotificationItem) => !n.read).length;

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'promo':
        return <Sparkles className="w-5 h-5 text-orange-500" />;
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-emerald-500" />;
      case 'reward':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-[var(--text-secondary)]" />;
    }
  };

  const formatTime = (dateInput?: string | number | Date) => {
    if (!dateInput) return 'Agora mesmo';
    const date = new Date(dateInput);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `Há ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Há ${diffInHours}h`;
    return date.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
            aria-label="Voltar para a página inicial"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Notificações
            </h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[var(--accent-primary)]/20">
                <Bell className="w-3 h-3 animate-bounce" />
                {unreadCount} nova{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Fique por dentro das atualizações do seu pedido e promoções exclusivas
          </p>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <div className="text-[var(--text-secondary)] pl-1 pr-2 border-r border-[var(--border-color)] hidden sm:block">
            <Filter className="w-4 h-4" />
          </div>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === 'all'
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-primary)]'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filter === 'unread'
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-primary)]'
            }`}
          >
            <span>Não Lidas</span>
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('order')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === 'order'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-primary)]'
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setFilter('promo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === 'promo'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-primary)]'
            }`}
          >
            Ofertas 🔥
          </button>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={markAllNotificationsRead}
            variant="outline"
            size="sm"
            className="text-xs font-bold border-[var(--border-color)] hover:bg-[var(--bg-primary)] flex items-center gap-1.5 shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-[var(--accent-primary)]" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification: NotificationItem) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`relative p-4 sm:p-5 rounded-2xl border transition-all ${
                  !notification.read
                    ? 'bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/30 shadow-md'
                    : 'bg-[var(--bg-secondary)]/60 border-[var(--border-color)] opacity-90 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shrink-0 shadow-sm">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] truncate">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(notification.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]/50">
                      {notification.link ? (
                        <Link
                          href={notification.link}
                          onClick={() => markNotificationRead(notification.id)}
                          className="text-xs font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1"
                        >
                          <span>Ver detalhes</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] opacity-75">
                          <Info className="w-3 h-3" />
                          <span>Informativo</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationRead(notification.id)}
                            title="Marcar como lida"
                            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-primary)] transition-colors"
                          >
                            <CheckCheck className="w-4 h-4 text-emerald-500" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          title="Eliminar notificação"
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-[var(--bg-primary)] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {!notification.read && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-4 bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] rounded-3xl"
            >
              <div className="w-16 h-16 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Inbox className="w-8 h-8 text-[var(--text-secondary)] opacity-50" />
              </div>
              <h3 className="font-bold text-lg mb-1">Sem notificações por aqui</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-6">
                {filter === 'unread'
                  ? 'Você já leu todas as suas notificações!'
                  : 'Não encontramos nenhuma notificação correspondente ao filtro selecionado.'}
              </p>
              {filter !== 'all' && (
                <Button
                  onClick={() => setFilter('all')}
                  variant="outline"
                  className="text-xs font-bold"
                >
                  Ver todas as notificações
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
