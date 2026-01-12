import { VariantWithProduct } from "@/features/variant/types";

export interface Cart {
  uuid: string;
  userId: string;
  items: CartItemWithVariant[];
  created_at: Date;
  updated_at: Date;
}

export interface CartResponse {
  uuid: string;
  userId: string;
  items: CartItemWithVariant[];
  itemCount: number;
  totalPrice: number;
  created_at: Date;
  updated_at: Date;
}


export interface CartItemWithVariant extends CartItem {
  variant: VariantWithProduct;
}


export interface CartItem {
  uuid: string;
  cartId: string;
  variantId: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface AddToCartRequest {
  variantId: string;
  quantity: number;
  token: string;
}

export interface UpdateCartItemRequest {
  uuid: string;
  quantity: number;
  token: string;
}


export interface Image {
  uuid: string;
  url: string;
  alt_text: string | null;
  position: number;
  created_at: Date;
  updated_at: Date;
  productId: string | null;
  variantId: string | null;
  // File metadata
  filename?: string | null;
  size?: number | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
}
