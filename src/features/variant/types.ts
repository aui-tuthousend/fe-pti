// import { InventoryItem, InventoryItemRequest } from "../inventory-item/types";

import { Image } from "@/routes/cart/-types";

export interface VariantImageRequest {
  url: string;
  alt_text?: string;
  position?: number;
}

export interface Variant {
  uuid: string;
  title: string;
  price: number;
  sku: string;
  available: number;
  cost: number;
  inventory_policy: string;
  option1: string;
  created_at: Date;
  updated_at: Date;
  images?: Image[];
}

export interface VariantWithProduct extends Variant {
  product: {
    uuid: string;
    title: string;
    product_type: string;
  };
}


export interface VariantRequest {
  productId?: string;
  uuid?: string;
  title: string;
  price: number;
  sku: string;
  inventory_policy: string;
  option1: string;
  available: number;
  cost: number;
  images?: VariantImageRequest[];
}