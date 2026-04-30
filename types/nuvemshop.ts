export interface NuvemshopImage {
  id: number;
  src: string;
  alt: string | null;
}

export interface NuvemshopVariant {
  id: number;
  price: string;
  compare_at_price: string | null;
  promotional_price?: string | null;
  stock: number | null;
  sku: string | null;
  values?: Array<string | { pt?: string; es?: string; en?: string }>;
  option_values?: Array<string | { pt?: string; es?: string; en?: string }>;
  attributes?: Array<string | { pt?: string; es?: string; en?: string }>;
  name?: string | { pt?: string; es?: string; en?: string };
  weight?: string | number | null;
  width?: string | number | null;
  height?: string | number | null;
  depth?: string | number | null;
}

export interface NuvemshopProduct {
  id: number;
  name: { pt: string; es?: string; en?: string };
  description: { pt: string };
  handle: { pt: string };
  images: NuvemshopImage[];
  variants: NuvemshopVariant[];
  categories: { id: number; name: { pt: string } }[];
}

export interface NuvemshopCategory {
  id: number;
  name: { pt: string };
  handle: { pt: string };
}
