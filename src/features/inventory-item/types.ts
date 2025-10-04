export interface InventoryItem {
  uuid: string;
  sku: string;
  tracked: boolean;
  available: number;
  cost: number;
  created_at: Date;
  updated_at: Date;
}

export interface InventoryItemRequest {
  sku: string;
  tracked: boolean;
  available: number;
  cost: number;
}