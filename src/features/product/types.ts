import { Variant, VariantRequest } from "../variant/types";

export interface ProductImage {
  uuid: string;
  url: string;
}

export interface ProductResponse {
  uuid: string;
  title: string;
  description: string;
  product_type: string;
  vendor: string;
  tags: string[];
  status: string;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  variants: Variant[];
  images: ProductImage[];
}

export interface PaginatedProductsResponse {
  data: ProductResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductRequest {
  title: string;
  description: string;
  product_type: string;
  vendor: string;
  tags: string[];
  status: string;
  variants: VariantRequest[];
}
