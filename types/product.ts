export interface ProductSizeVariant {
  size: string;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  sizeVariants: ProductSizeVariant[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  sizeVariants: ProductSizeVariant[];
  isActive: boolean;
}

export interface ProductQueryResponse {
  products: Product[];
}