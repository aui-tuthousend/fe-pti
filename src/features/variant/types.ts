// import { InventoryItem, InventoryItemRequest } from "../inventory-item/types";

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
  inventory_quantity: number;
  inventory_policy: string;
  option1: string;
  created_at: Date;
  updated_at: Date;
  images?: { uuid: string; url: string; alt_text?: string; position?: number }[];
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