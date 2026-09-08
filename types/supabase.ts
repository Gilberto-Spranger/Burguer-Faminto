export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          phone_secondary: string | null;
          avatar: string | null;
          birth_date: string | null;
          gender: string | null;
          preferred_neighborhood: string | null;
          bio: string | null;
          points: number;
          points_to_next_level: number;
          next_level_points: number;
          level: string;
          role_id: string;
          created_at: number;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone?: string | null;
          phone_secondary?: string | null;
          avatar?: string | null;
          birth_date?: string | null;
          gender?: string | null;
          preferred_neighborhood?: string | null;
          bio?: string | null;
          points?: number;
          points_to_next_level?: number;
          next_level_points?: number;
          level?: string;
          role_id?: string;
          created_at?: number;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          phone_secondary?: string | null;
          avatar?: string | null;
          birth_date?: string | null;
          gender?: string | null;
          preferred_neighborhood?: string | null;
          bio?: string | null;
          points?: number;
          points_to_next_level?: number;
          next_level_points?: number;
          level?: string;
          role_id?: string;
          created_at?: number;
        };
      };
      user_addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          address: string;
          reference: string | null;
          is_default: boolean | null;
        };
        Insert: {
          id: string;
          user_id: string;
          label: string;
          address: string;
          reference?: string | null;
          is_default?: boolean | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          address?: string;
          reference?: string | null;
          is_default?: boolean | null;
        };
      };
      user_dietary_preferences: {
        Row: {
          id: string;
          user_id: string;
          preference: string;
        };
        Insert: {
          id: string;
          user_id: string;
          preference: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          preference?: string;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          icon: string;
          description: string;
        };
        Insert: {
          id: string;
          name: string;
          icon: string;
          description: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          description?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          is_unlocked: boolean;
          unlocked_at: string | null;
        };
        Insert: {
          id: string;
          user_id: string;
          badge_id: string;
          is_unlocked?: boolean;
          unlocked_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          is_unlocked?: boolean;
          unlocked_at?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          promotional_price: number | null;
          category_id: string;
          image: string;
          rating: number;
          sales_count: number;
          is_available: boolean;
          is_featured: boolean | null;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          price: number;
          promotional_price?: number | null;
          category_id: string;
          image: string;
          rating?: number;
          sales_count?: number;
          is_available?: boolean;
          is_featured?: boolean | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          promotional_price?: number | null;
          category_id?: string;
          image?: string;
          rating?: number;
          sales_count?: number;
          is_available?: boolean;
          is_featured?: boolean | null;
        };
      };
      product_tags: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      product_product_tags: {
        Row: {
          product_id: string;
          tag_id: string;
        };
        Insert: {
          product_id: string;
          tag_id: string;
        };
        Update: {
          product_id?: string;
          tag_id?: string;
        };
      };
      product_ingredients: {
        Row: {
          id: string;
          product_id: string;
          ingredient: string;
        };
        Insert: {
          id: string;
          product_id: string;
          ingredient: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          ingredient?: string;
        };
      };
      product_extra_options: {
        Row: {
          id: string;
          name: string;
          price: number;
          category: string;
        };
        Insert: {
          id: string;
          name: string;
          price: number;
          category: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          category?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          name: string;
          neighborhood: string;
          city: string;
          address: string;
          reference: string | null;
          phone: string;
          whatsapp: string | null;
          hours: string;
          is_open: boolean;
          latitude: number;
          longitude: number;
          image: string;
        };
        Insert: {
          id: string;
          name: string;
          neighborhood: string;
          city: string;
          address: string;
          reference?: string | null;
          phone: string;
          whatsapp?: string | null;
          hours: string;
          is_open?: boolean;
          latitude?: number;
          longitude?: number;
          image: string;
        };
        Update: {
          id?: string;
          name?: string;
          neighborhood?: string;
          city?: string;
          address?: string;
          reference?: string | null;
          phone?: string;
          whatsapp?: string | null;
          hours?: string;
          is_open?: boolean;
          latitude?: number;
          longitude?: number;
          image?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: string;
          discount_value: number;
          min_order_value: number;
          description: string;
          expires_at: string;
        };
        Insert: {
          id: string;
          code: string;
          discount_type: string;
          discount_value: number;
          min_order_value: number;
          description: string;
          expires_at: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: string;
          discount_value?: number;
          min_order_value?: number;
          description?: string;
          expires_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          subtotal: number;
          delivery_fee: number;
          discount: number;
          total: number;
          status: string;
          payment_method: string;
          created_at: number;
        };
        Insert: {
          id: string;
          order_number: string;
          user_id: string;
          subtotal: number;
          delivery_fee: number;
          discount: number;
          total: number;
          status: string;
          payment_method: string;
          created_at?: number;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          subtotal?: number;
          delivery_fee?: number;
          discount?: number;
          total?: number;
          status?: string;
          payment_method?: string;
          created_at?: number;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          total_price: number;
        };
        Insert: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          total_price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          total_price?: number;
        };
      };
      order_item_extras: {
        Row: {
          id: string;
          order_item_id: string;
          name: string;
          price: number;
        };
        Insert: {
          id: string;
          order_item_id: string;
          name: string;
          price: number;
        };
        Update: {
          id?: string;
          order_item_id?: string;
          name?: string;
          price?: number;
        };
      };
      order_item_customizations: {
        Row: {
          id: string;
          order_item_id: string;
          bread: string | null;
          meat: string | null;
          cheese: string | null;
        };
        Insert: {
          id: string;
          order_item_id: string;
          bread?: string | null;
          meat?: string | null;
          cheese?: string | null;
        };
        Update: {
          id?: string;
          order_item_id?: string;
          bread?: string | null;
          meat?: string | null;
          cheese?: string | null;
        };
      };
      order_delivery_addresses: {
        Row: {
          id: string;
          order_id: string;
          name: string;
          phone: string;
          address: string;
          reference: string | null;
        };
        Insert: {
          id: string;
          order_id: string;
          name: string;
          phone: string;
          address: string;
          reference?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          name?: string;
          phone?: string;
          address?: string;
          reference?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          provider: string;
          payment_method: string;
          transaction_id: string | null;
          merchant_transaction_id: string | null;
          amount: number;
          currency: string;
          status: string;
          raw_response: Json | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          order_id: string;
          provider: string;
          payment_method: string;
          transaction_id?: string | null;
          merchant_transaction_id?: string | null;
          amount: number;
          currency?: string;
          status: string;
          raw_response?: Json | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          provider?: string;
          payment_method?: string;
          transaction_id?: string | null;
          merchant_transaction_id?: string | null;
          amount?: number;
          currency?: string;
          status?: string;
          raw_response?: Json | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      order_payments: {
        Row: {
          id: string;
          order_id: string;
          payment_method: string;
          entity: string | null;
          reference: string | null;
          expiry_date: string | null;
          phone: string | null;
          paid_at: string | null;
        };
        Insert: {
          id: string;
          order_id: string;
          payment_method: string;
          entity?: string | null;
          reference?: string | null;
          expiry_date?: string | null;
          phone?: string | null;
          paid_at?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          payment_method?: string;
          entity?: string | null;
          reference?: string | null;
          expiry_date?: string | null;
          phone?: string | null;
          paid_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          message: string;
          read: boolean;
          type: string | null;
          order_id: string | null;
          link: string | null;
          action_label: string | null;
          created_at: number;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          title: string;
          message: string;
          read?: boolean;
          type?: string | null;
          order_id?: string | null;
          link?: string | null;
          action_label?: string | null;
          created_at?: number;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          message?: string;
          read?: boolean;
          type?: string | null;
          order_id?: string | null;
          link?: string | null;
          action_label?: string | null;
          created_at?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
