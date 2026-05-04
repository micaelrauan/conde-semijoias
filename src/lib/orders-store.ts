import fs from "fs";
import path from "path";

const LOCAL_FILE = path.join(process.cwd(), "data", "orders.json");
const TEMP_FILE = path.join("/tmp", "conde-semijoias", "orders.json");

function getOrdersFilePath(): string {
  const overridePath = process.env.ORDERS_STORE_PATH;

  if (overridePath) {
    return overridePath;
  }

  if (
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY ||
    process.env.NODE_ENV === "production"
  ) {
    return TEMP_FILE;
  }

  return LOCAL_FILE;
}

function getReadablePaths(): string[] {
  const primaryPath = getOrdersFilePath();

  if (primaryPath === LOCAL_FILE) {
    return [LOCAL_FILE, TEMP_FILE];
  }

  return [primaryPath, LOCAL_FILE];
}

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
  for (const filePath of getReadablePaths()) {
    try {
      if (!fs.existsSync(filePath)) {
        continue;
      }

      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as StoredOrder[];
    } catch {
      continue;
    }
  }

  return [];
}

function writeOrders(orders: StoredOrder[]) {
  const filePath = getOrdersFilePath();
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
}

export function saveOrder(order: StoredOrder) {
  const orders = readOrders().filter(
    (o) => o.id !== order.id && o.token !== order.token,
  );
  writeOrders([order, ...orders]);
}

export function getOrdersByEmail(email: string): StoredOrder[] {
  return readOrders().filter((o) => o.customerEmail === email);
}

export function getOrderById(id: number): StoredOrder | null {
  return readOrders().find((o) => o.id === id) ?? null;
}
