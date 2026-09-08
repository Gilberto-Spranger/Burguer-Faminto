export type Role = 'user' | 'admin';

export interface UserAddress {
  id: string;
  label: string;
  address: string;
  reference?: string;
  isDefault?: boolean;
}

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  description: string;
  expiresAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneSecondary?: string;
  avatar?: string;
  birthDate?: string;
  gender?: string;
  preferredNeighborhood?: string;
  bio?: string;
  dietaryPreferences?: string[];
  points: number;
  pointsToNextLevel: number;
  nextLevelPoints: number;
  level: 'FAMINTO NOVATO' | 'FAMINTO' | 'FAMINTO PRO' | 'FAMINTO MESTRE' | 'FAMINTO LENDÁRIO';
  role: Role;
  addresses: UserAddress[];
  badges: UserBadge[];
  favorites?: string[];
  createdAt: number;
}

export interface ProductExtraOption {
  id: string;
  name: string;
  price: number;
  category: 'pao' | 'carne' | 'queijo' | 'extra';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice?: number;
  category: 'Burgers' | 'Combos' | 'Pizzas' | 'Bebidas' | 'Salgados' | 'Snacks' | 'Sobremesas' | 'Acompanhamentos' | 'Promoções';
  image: string;
  rating: number;
  salesCount: number;
  tags: string[];
  ingredients?: string[];
  isAvailable: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  extras?: { name: string; price: number }[];
  customizations?: {
    bread?: string;
    meat?: string;
    cheese?: string;
  };
  totalPrice: number;
}

export type OrderStatus = 'Pendente' | 'Processando' | 'Preparação' | 'Pronto' | 'A caminho' | 'Entregue' | 'Cancelado';
export type PaymentMethod = 
  | 'AppyPay Express'
  | 'AppyPay Referência'
  | 'Multicaixa Express'
  | 'Referência Multicaixa'
  | 'UNITEL Money'
  | 'Débito Directo'
  | 'Cartão'
  | 'Dinheiro na Entrega';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    entity?: string;
    reference?: string;
    expiryDate?: string;
    phone?: string;
    paidAt?: string;
  };
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    reference?: string;
  };
  createdAt: number;
}

export interface Store {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
  address: string;
  reference: string;
  phone: string;
  whatsapp: string;
  hours: string;
  isOpen: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  distanceKm?: number;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  read: boolean;
  type?: 'order' | 'promo' | 'system';
  orderId?: string;
  link?: string;
  actionLabel?: string;
  createdAt: number;
}
