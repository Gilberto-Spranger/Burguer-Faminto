import { create } from 'zustand';
import {
  CartItem,
  Product,
  User,
  Store,
  Order,
  NotificationItem,
} from '@/types';
import { supabase } from './supabase/client';
import {
  markNotificationRead as markNotifRead,
  markAllNotificationsRead as markAllNotifRead,
  deleteNotification as deleteNotif,
  subscribeToNotifications,
  createNotification,
} from './supabase/supabase-notifications';

interface AppState {
  products: Product[];
  isProductsLoading: boolean;
  loadProducts: () => Promise<void>;

  stores: Store[];
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;

  user: User | null;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;

  isPushEnabled: boolean;
  requestPushPermission: () => Promise<void>;
  sendTestPush: () => Promise<void>;

  favorites: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;

  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  loadUserOrders: (userId: string) => Promise<void>;

  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (
    product: Product,
    quantity?: number,
    extras?: { name: string; price: number }[],
    customizations?: {
      bread?: string;
      meat?: string;
      cheese?: string;
    }
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (isOpen: boolean) => void;

  isFamintoMode: boolean;
  setFamintoMode: (active: boolean) => void;

  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;

  initApp: () => void;
}

let notifUnsubscribe: (() => void) | null = null;
let authSubscription: { unsubscribe: () => void } | null = null;

const db = supabase as any;

const normalizeLevel = (level: unknown): User['level'] => {
  switch (level) {
    case 'FAMINTO':
      return 'FAMINTO';
    case 'FAMINTO LENDÁRIO':
      return 'FAMINTO LENDÁRIO';
    case 'FAMINTO MESTRE':
      return 'FAMINTO MESTRE';
    case 'FAMINTO PRO':
      return 'FAMINTO PRO';
    case 'FAMINTO NOVATO':
    default:
      return 'FAMINTO NOVATO';
  }
};

const normalizeCreatedAt = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return Date.now();
};

export const useStore = create<AppState>((set, get) => ({
  products: [],
  isProductsLoading: false,

  loadProducts: async () => {
    set({ isProductsLoading: true });

    try {
      const { data, error } = await db
        .from('products')
        .select('*')
        .order('sales_count', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const mappedProducts: Product[] = data.map((p: any) => ({
          id: String(p.id),
          name: String(p.name || ''),
          description: String(p.description || ''),
          price: Number(p.price || 0),
          promotionalPrice: p.promotional_price ? Number(p.promotional_price) : undefined,
          category: p.category_id || p.category || 'Burgers',
          image: p.image || '/produtos/hamburguer.png',
          rating: Number(p.rating || 5.0),
          salesCount: Number(p.sales_count || 0),
          tags: Array.isArray(p.tags) ? p.tags : (p.is_featured ? ['🔥 MAIS VENDIDO'] : []),
          ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
          isAvailable: p.is_available !== false,
          isFeatured: Boolean(p.is_featured),
        }));

        set({ products: mappedProducts });
      } else {
        set({ products: [] });
      }
    } catch (error) {
      console.error('Erro ao carregar produtos do Supabase:', error);
      set({ products: [] });
    } finally {
      set({ isProductsLoading: false });
    }

    try {
      const { data, error } = await db
        .from('stores')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const mappedStores: Store[] = data.map((s: any) => ({
          id: String(s.id),
          name: String(s.name || ''),
          neighborhood: String(s.neighborhood || ''),
          city: String(s.city || 'Luanda'),
          address: String(s.address || ''),
          reference: String(s.reference || ''),
          phone: String(s.phone || ''),
          whatsapp: String(s.whatsapp || s.phone || ''),
          hours: String(s.hours || '10:00 - 23:00'),
          isOpen: s.is_open !== false,
          coordinates: {
            lat: Number(s.latitude || -8.8252),
            lng: Number(s.longitude || 13.2344),
          },
          image: s.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60',
        }));

        set({
          stores: mappedStores,
          selectedStore: get().selectedStore || mappedStores[0] || null,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar lojas do Supabase:', error);
    }
  },

  stores: [],
  selectedStore: null,

  setSelectedStore: (store) => {
    set({ selectedStore: store });
  },

  user: null,
  isAuthLoading: true,

  setUser: (user) => {
    set({
      user,
      favorites: user?.favorites || [],
    });
  },

  updateUserProfile: async (updates) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      ...updates,
    };

    set({ user: updatedUser });

    try {
      const dbUpdates: Record<string, unknown> = {};

      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
      if (updates.birthDate !== undefined) dbUpdates.birth_date = updates.birthDate;
      if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
      if (updates.preferredNeighborhood !== undefined) dbUpdates.preferred_neighborhood = updates.preferredNeighborhood;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.points !== undefined) dbUpdates.points = updates.points;
      if (updates.pointsToNextLevel !== undefined) dbUpdates.points_to_next_level = updates.pointsToNextLevel;
      if (updates.nextLevelPoints !== undefined) dbUpdates.next_level_points = updates.nextLevelPoints;
      if (updates.level !== undefined) dbUpdates.level = updates.level;

      if (Object.keys(dbUpdates).length > 0) {
        const { error } = await db
          .from('users')
          .update(dbUpdates)
          .eq('id', currentUser.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil no Supabase:', error);
    }
  },

  logout: async () => {
    try {
      if (notifUnsubscribe) {
        notifUnsubscribe();
        notifUnsubscribe = null;
      }

      if (authSubscription) {
        authSubscription.unsubscribe();
        authSubscription = null;
      }

      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao terminar sessão:', error);
    } finally {
      set({
        user: null,
        notifications: [],
        favorites: [],
        orders: [],
        isAuthLoading: false,
      });
    }
  },

  notifications: [],

  markNotificationRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));

    try {
      await markNotifRead(id);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  },

  markAllNotificationsRead: async () => {
    const currentUser = get().user;
    if (!currentUser) return;

    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));

    try {
      await markAllNotifRead(currentUser.id);
    } catch (error) {
      console.error('Erro ao marcar notificações como lidas:', error);
    }
  },

  deleteNotification: async (id) => {
    const prev = get().notifications;
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));

    try {
      await deleteNotif(id);
    } catch (error) {
      console.error('Erro ao eliminar notificação:', error);
      set({ notifications: prev });
    }
  },

  isPushEnabled: false,

  requestPushPermission: async () => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) {
      throw new Error('Este dispositivo não suporta notificações do navegador.');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      set({ isPushEnabled: false });
      throw new Error('Permissão para notificações não foi concedida.');
    }

    set({ isPushEnabled: true });
  },

  sendTestPush: async () => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) {
      throw new Error('Este dispositivo não suporta notificações.');
    }

    if (Notification.permission !== 'granted') {
      throw new Error('Ativa primeiro as notificações nas definições.');
    }

    new Notification('Burguer Faminto', {
      body: 'As tuas notificações em tempo real estão ativas!',
      icon: '/icon-192.png',
    });
  },

  favorites: [],

  toggleFavorite: async (productId) => {
    const currentUser = get().user;
    const currentFavorites = get().favorites;
    const isCurrentlyFavorite = currentFavorites.includes(productId);
    const updatedFavorites = isCurrentlyFavorite
      ? currentFavorites.filter((id) => id !== productId)
      : [...currentFavorites, productId];

    set({
      favorites: updatedFavorites,
      user: currentUser ? { ...currentUser, favorites: updatedFavorites } : null,
    });

    if (!currentUser) return;

    try {
      if (isCurrentlyFavorite) {
        await db
          .from('favorites')
          .delete()
          .match({ user_id: currentUser.id, product_id: productId });
      } else {
        await db
          .from('favorites')
          .insert({ user_id: currentUser.id, product_id: productId });
      }
    } catch (error) {
      console.error('Erro ao persistir favorito no Supabase:', error);
      set({
        favorites: currentFavorites,
        user: currentUser ? { ...currentUser, favorites: currentFavorites } : null,
      });
    }
  },

  isFavorite: (productId) => {
    return get().favorites.includes(productId);
  },

  orders: [],

  addOrder: async (newOrder) => {
    const previousOrders = get().orders;
    set((state) => ({ orders: [newOrder, ...state.orders] }));

    try {
      const { error: orderError } = await db.from('orders').insert({
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        user_id: newOrder.userId,
        subtotal: newOrder.subtotal,
        delivery_fee: newOrder.deliveryFee,
        discount: newOrder.discount,
        total: newOrder.total,
        status: newOrder.status,
        payment_method: newOrder.paymentMethod,
        created_at: newOrder.createdAt,
      });

      if (orderError) throw orderError;

      for (const item of newOrder.items) {
        const { data: itemData, error: itemError } = await db.from('order_items').insert({
          id: item.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
          order_id: newOrder.id,
          product_id: item.product.id,
          quantity: item.quantity,
          total_price: item.totalPrice,
        }).select().single();

        if (!itemError && itemData) {
          if (item.extras && item.extras.length > 0) {
            const extrasRows = item.extras.map((extra) => ({
              id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
              order_item_id: itemData.id,
              name: extra.name,
              price: extra.price,
            }));
            await db.from('order_item_extras').insert(extrasRows);
          }

          if (item.customizations) {
            await db.from('order_item_customizations').insert({
              id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
              order_item_id: itemData.id,
              bread: item.customizations.bread || null,
              meat: item.customizations.meat || null,
              cheese: item.customizations.cheese || null,
            });
          }
        }
      }

      if (newOrder.deliveryAddress) {
        await db.from('order_delivery_addresses').insert({
          id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
          order_id: newOrder.id,
          name: newOrder.deliveryAddress.name,
          phone: newOrder.deliveryAddress.phone,
          address: newOrder.deliveryAddress.address,
          reference: newOrder.deliveryAddress.reference || null,
        });
      }

      if (newOrder.paymentDetails) {
        await db.from('order_payments').insert({
          id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
          order_id: newOrder.id,
          payment_method: newOrder.paymentMethod,
          entity: newOrder.paymentDetails.entity || null,
          reference: newOrder.paymentDetails.reference || null,
          expiry_date: newOrder.paymentDetails.expiryDate || null,
          phone: newOrder.paymentDetails.phone || null,
          paid_at: newOrder.paymentDetails.paidAt || null,
        });
      }

      await createNotification({
        userId: newOrder.userId,
        title: 'Pedido Recebido!',
        message: `O teu pedido #${newOrder.orderNumber} foi registado e está em processamento na cozinha.`,
        type: 'order',
        orderId: newOrder.id,
        link: '/pedidos',
        actionLabel: 'Ver Pedido',
      });
    } catch (error) {
      console.error('Erro ao registar pedido no Supabase:', error);
      set({ orders: previousOrders });
      throw error;
    }
  },

  loadUserOrders: async (userId) => {
    if (!userId) {
      set({ orders: [] });
      return;
    }

    try {
      const { data, error } = await db
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            total_price,
            product_id,
            order_item_extras (name, price),
            order_item_customizations (bread, meat, cheese)
          ),
          order_delivery_addresses (*),
          order_payments (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const products = get().products;

      const mappedOrders: Order[] = (data || []).map((o: any) => {
        const items: CartItem[] = (o.order_items || []).map((oi: any) => {
          const matchedProduct = products.find((p) => p.id === oi.product_id) || {
            id: oi.product_id,
            name: 'Produto Faminto',
            description: '',
            price: Number(oi.total_price / (oi.quantity || 1)),
            category: 'Burgers',
            image: '/produtos/hamburguer.png',
            rating: 5.0,
            salesCount: 1,
            tags: [],
            isAvailable: true,
          };

          return {
            id: oi.id,
            product: matchedProduct,
            quantity: oi.quantity,
            totalPrice: Number(oi.total_price),
            extras: (oi.order_item_extras || []).map((e: any) => ({ name: e.name, price: Number(e.price) })),
            customizations: oi.order_item_customizations?.[0] || undefined,
          };
        });

        const deliveryAddress = o.order_delivery_addresses?.[0] || {
          name: '',
          phone: '',
          address: '',
        };

        const payment = o.order_payments?.[0];

        return {
          id: o.id,
          orderNumber: o.order_number,
          userId: o.user_id,
          items,
          subtotal: Number(o.subtotal),
          deliveryFee: Number(o.delivery_fee),
          discount: Number(o.discount),
          total: Number(o.total),
          status: o.status,
          paymentMethod: o.payment_method,
          deliveryAddress: {
            name: deliveryAddress.name,
            phone: deliveryAddress.phone,
            address: deliveryAddress.address,
            reference: deliveryAddress.reference,
          },
          paymentDetails: payment ? {
            entity: payment.entity,
            reference: payment.reference,
            expiryDate: payment.expiry_date,
            phone: payment.phone,
            paidAt: payment.paid_at,
          } : undefined,
          createdAt: normalizeCreatedAt(o.created_at),
        };
      });

      set({ orders: mappedOrders });
    } catch (error) {
      console.error('Erro ao carregar pedidos do Supabase:', error);
      set({ orders: [] });
    }
  },

  cart: [],
  isCartOpen: false,

  addToCart: (product, quantity = 1, extras = [], customizations = {}) => {
    const cart = get().cart;

    const extrasKey = extras
      .map((extra) => extra.name)
      .sort()
      .join(',');

    const customKey = [
      customizations.bread || '',
      customizations.meat || '',
      customizations.cheese || '',
    ].join('-');

    const existingItemIndex = cart.findIndex((item) => {
      const itemExtrasKey = (item.extras || [])
        .map((extra) => extra.name)
        .sort()
        .join(',');

      const itemCustomKey = [
        item.customizations?.bread || '',
        item.customizations?.meat || '',
        item.customizations?.cheese || '',
      ].join('-');

      return (
        item.product.id === product.id &&
        itemExtrasKey === extrasKey &&
        itemCustomKey === customKey
      );
    });

    const basePrice = product.promotionalPrice ?? product.price;
    const extrasTotal = extras.reduce((total, extra) => total + extra.price, 0);
    const unitPrice = basePrice + extrasTotal;

    if (existingItemIndex >= 0) {
      const newCart = [...cart];
      const existingItem = newCart[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      newCart[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        totalPrice: unitPrice * newQuantity,
      };

      set({ cart: newCart, isCartOpen: true });
      return;
    }

    const newItem: CartItem = {
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      product,
      quantity,
      extras,
      customizations,
      totalPrice: unitPrice * quantity,
    };

    set({ cart: [...cart, newItem], isCartOpen: true });
  },

  removeFromCart: (cartItemId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== cartItemId),
    }));
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      set((state) => ({
        cart: state.cart.filter((item) => item.id !== cartItemId),
      }));
      return;
    }

    set((state) => ({
      cart: state.cart.map((item) => {
        if (item.id !== cartItemId) return item;
        const basePrice = item.product.promotionalPrice ?? item.product.price;
        const extrasTotal = item.extras?.reduce((total, extra) => total + extra.price, 0) || 0;
        return {
          ...item,
          quantity,
          totalPrice: (basePrice + extrasTotal) * quantity,
        };
      }),
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  setCartOpen: (isOpen) => {
    set({ isCartOpen: isOpen });
  },

  isFamintoMode: false,

  setFamintoMode: (active) => {
    set({ isFamintoMode: active });
  },

  isDarkMode: true,

  setDarkMode: (isDark) => {
    set({ isDarkMode: isDark });
  },

  initApp: () => {
    if (typeof window === 'undefined') return;

    void get().loadProducts();

    if (authSubscription) return;

    const handleAuthenticatedUser = async (userId: string) => {
      try {
        set({ isAuthLoading: true });

        const [userRes, favsRes, addressesRes, badgesRes] = await Promise.all([
          db.from('users').select('*').eq('id', userId).maybeSingle(),
          db.from('favorites').select('product_id').eq('user_id', userId),
          db.from('user_addresses').select('*').eq('user_id', userId),
          db.from('user_badges').select('*, badges(*)').eq('user_id', userId),
        ]);

        const profileData = userRes.data;

        if (!profileData) {
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser?.user) {
            await db.from('users').upsert({
              id: authUser.user.id,
              name: authUser.user.user_metadata?.name || authUser.user.email?.split('@')[0] || 'Cliente Faminto',
              email: authUser.user.email || '',
              avatar: authUser.user.user_metadata?.avatar || '/avatars/young.jpg',
              points: 0,
              points_to_next_level: 1000,
              next_level_points: 1000,
              level: 'FAMINTO NOVATO',
              role_id: 'user',
              created_at: Date.now(),
            });
            await handleAuthenticatedUser(userId);
            return;
          }

          set({
            user: null,
            favorites: [],
            notifications: [],
            orders: [],
          });
          return;
        }

        const favIds: string[] = (favsRes.data || []).map((f: any) => String(f.product_id));

        const user: User = {
          id: profileData.id,
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          avatar: profileData.avatar || '/avatars/young.jpg',
          birthDate: profileData.birth_date || '',
          gender: profileData.gender || '',
          preferredNeighborhood: profileData.preferred_neighborhood || '',
          bio: profileData.bio || '',
          points: profileData.points || 0,
          pointsToNextLevel: profileData.points_to_next_level || 1000,
          nextLevelPoints: profileData.next_level_points || 1000,
          level: normalizeLevel(profileData.level),
          role: profileData.role_id === 'admin' ? 'admin' : 'user',
          addresses: (addressesRes.data || []).map((a: any) => ({
            id: a.id,
            label: a.label,
            address: a.address,
            reference: a.reference || undefined,
            isDefault: Boolean(a.is_default),
          })),
          badges: (badgesRes.data || []).map((ub: any) => ({
            id: ub.badge_id,
            name: ub.badges?.name || 'Medalha Faminto',
            icon: ub.badges?.icon || '🏆',
            description: ub.badges?.description || '',
            isUnlocked: Boolean(ub.is_unlocked),
            unlockedAt: ub.unlocked_at || undefined,
          })),
          favorites: favIds,
          createdAt: normalizeCreatedAt(profileData.created_at),
        };

        set({
          user,
          favorites: favIds,
        });

        if (notifUnsubscribe) {
          notifUnsubscribe();
          notifUnsubscribe = null;
        }

        notifUnsubscribe = subscribeToNotifications(userId, (notifications) => {
          set({ notifications });
        });

        await get().loadUserOrders(userId);
      } catch (error) {
        console.error('Erro ao carregar utilizador do Supabase:', error);
        set({
          user: null,
          favorites: [],
          notifications: [],
          orders: [],
        });
      } finally {
        set({ isAuthLoading: false });
      }
    };

    const initializeSession = async () => {
      set({ isAuthLoading: true });

      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Sessão ativa:', session);
      console.log('Erro de sessão:', error);

      if (error) {
        console.error('Erro ao obter sessão:', error);
        set({
          user: null,
          favorites: [],
          notifications: [],
          orders: [],
          isAuthLoading: false,
        });
        return;
      }

      if (session?.user) {
        await handleAuthenticatedUser(session.user.id);
      } else {
        set({
          user: null,
          favorites: [],
          notifications: [],
          orders: [],
          isAuthLoading: false,
        });
      }
    };

    authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
        void handleAuthenticatedUser(session.user.id);
        return;
      }

      if (event === 'SIGNED_OUT') {
        if (notifUnsubscribe) {
          notifUnsubscribe();
          notifUnsubscribe = null;
        }

        set({
          user: null,
          notifications: [],
          favorites: [],
          orders: [],
          isAuthLoading: false,
        });
      }
    }).data.subscription;

    void initializeSession();
  },
}));
