import { InventoryItem, InventoryItemRequest } from "../inventory-item/types";

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
  inventory_item?: InventoryItem;
}

export interface VariantRequest {
  uuid?: string;
  title: string;
  price: number;
  sku: string;
  inventory_policy: string;
  option1: string;
  inventory_item: InventoryItemRequest;
}