export type WeightOption = '5kg' | '10kg' | '25kg' | '50kg';

export type CategorySlug =
  | 'gao-an-gia-dinh'
  | 'gao-quan-com-nha-hang'
  | 'gao-tu-thien'
  | 'gao-nau-bun-mi-pho';

export interface ProductMetrics {
  stickiness: number; // Độ dẻo 1-5
  fluffiness: number; // Độ nở 1-5
  softness: number; // Độ mềm 1-5
  fragrance: number; // Độ thơm 1-5
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: CategorySlug;
  categoryLabel: string;
  origin: string;
  pricePerKg: number; // indicative price for display
  weights: WeightOption[];
  image: string;
  gallery?: string[];
  metrics: ProductMetrics;
  bestSeller?: boolean;
  tags: string[];
  usage: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  weight: WeightOption;
  quantity: number;
  image: string;
  pricePerKg: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  image: string;
}

export interface Category {
  slug: CategorySlug;
  label: string;
  description: string;
  icon: string;
}
