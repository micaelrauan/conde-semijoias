import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "orders.json");

export interface StoredOrder {
  id: number;
  token: string;
  customerEmail: string;
  customerName: string;
  total: string;
  subtotal: string;
  status: string;
  createdAt: string;
  products: {
    name: string;
    quantity: number;
    price: string;
    image?: string;
  }[];
  shippingAddress?: {
    address: string;
    city: string;
    province: string;
    zipcode: string;
    country: string;
  };
}

function readOrders(): StoredOrder[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf-8")) as StoredOrder[];
  } catch {
    return [];
  }
}

function writeOrders(orders: StoredOrder[]) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(orders, null, 2));
}

export function saveOrder(order: StoredOrder) {
  const orders = readOrders().filter((o) => o.id !== order.id);
  writeOrders([order, ...orders]);
}

export function getOrdersByEmail(email: string): StoredOrder[] {
  return readOrders().filter((o) => o.customerEmail === email);
}

export function getOrderById(id: number): StoredOrder | null {
  return readOrders().find((o) => o.id === id) ?? null;
}
