import type { CartItem, Order, OrderItem, Profile } from "./types";

const now = new Date().toISOString();

export const mockProfiles: Profile[] = [
  {
    id: "demo-user",
    name: "Cliente Demo",
    phone: "(11) 99999-0000",
    cpf: "000.000.000-00",
    created_at: now,
    updated_at: now,
  },
  {
    id: "admin-user",
    name: "Admin Demo",
    phone: "(11) 99999-1111",
    cpf: "111.111.111-11",
    created_at: now,
    updated_at: now,
  },
];

export const mockOrders: Order[] = [
  {
    id: "order-1",
    user_id: "demo-user",
    status: "pending",
    total: 369.8,
    shipping_address_street: "Rua das Flores",
    shipping_address_number: "123",
    shipping_address_neighborhood: "Centro",
    shipping_address_city: "Sao Paulo",
    shipping_address_state: "SP",
    shipping_address_zipcode: "01000-000",
    created_at: now,
    updated_at: now,
  },
  {
    id: "order-2",
    user_id: "demo-user",
    status: "completed",
    total: 149.9,
    shipping_address_street: "Avenida Paulista",
    shipping_address_number: "1500",
    shipping_address_neighborhood: "Bela Vista",
    shipping_address_city: "Sao Paulo",
    shipping_address_state: "SP",
    shipping_address_zipcode: "01310-100",
    created_at: now,
    updated_at: now,
  },
];

export const mockOrderItems: OrderItem[] = [
  {
    id: "order-item-1",
    order_id: "order-1",
    product_id: "prod-1",
    quantity: 1,
    price: 219.9,
    created_at: now,
  },
  {
    id: "order-item-2",
    order_id: "order-1",
    product_id: "prod-4",
    quantity: 1,
    price: 149.9,
    created_at: now,
  },
  {
    id: "order-item-3",
    order_id: "order-2",
    product_id: "prod-2",
    quantity: 1,
    price: 149.9,
    created_at: now,
  },
];

export const mockCartByUser: Record<string, CartItem[]> = {
  "demo-user": [
    {
      id: "cart-1",
      user_id: "demo-user",
      product_id: "prod-3",
      quantity: 1,
      created_at: now,
      updated_at: now,
    },
  ],
};
