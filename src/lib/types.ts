// ============================================
// TYPES - Tipos do banco de dados
// ============================================

export interface Profile {
  id: string;
  name: string;
  phone?: string;
  cpf?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  src: string;
  alt?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  variant_id?: number;
  category_id?: string;
  image_url?: string;
  images?: ProductImage[];
  slug: string;
  is_active: boolean;
  compare_at_price?: number;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  shipping_address_street: string;
  shipping_address_number: string;
  shipping_address_complement?: string;
  shipping_address_neighborhood: string;
  shipping_address_city: string;
  shipping_address_state: string;
  shipping_address_zipcode: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: Product;
}

// ============================================
// DTO - Data Transfer Objects
// ============================================

export interface CreateOrderDTO {
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  shipping_address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  };
}

export interface UpdateProfileDTO {
  name?: string;
  phone?: string;
  cpf?: string;
}

export interface AddToCartDTO {
  product_id: string;
  quantity: number;
}
