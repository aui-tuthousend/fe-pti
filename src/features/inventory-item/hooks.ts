import { create } from 'zustand';
import { fetchServer } from '@/lib/fetchServer';
import { urlBuilder } from "@/lib/utils";
import type { InventoryItem, InventoryItemRequest } from "./types";

interface InventoryItemStore {
  list: InventoryItem[];
  default: InventoryItem;
  model: InventoryItem | InventoryItemRequest;
  loading: boolean;
  tableAttributes: Array<{
    accessorKey: string;
    header: string;
  }>;

  setModel: (model?: InventoryItem | InventoryItemRequest) => void;
  CreateInventoryItem: (token: string, payload: InventoryItemRequest) => Promise<any>;
  GetListInventoryItem: (token: string) => Promise<any>;
}

export const useInventoryItemStore = create<InventoryItemStore>((set, get) => ({
  list: [],
  default: {
    uuid: "",
    sku: "",
    tracked: false,
    available: 0,
    cost: 0,
    created_at: new Date(),
    updated_at: new Date(),
  },
  model: {
    uuid: "",
    sku: "",
    tracked: false,
    available: 0,
    cost: 0,
    created_at: new Date(),
    updated_at: new Date(),
  },
  loading: false,
  tableAttributes: [
    {
      accessorKey: "uuid",
      header: "UUID",
    },
    {
      accessorKey: "sku",
      header: "SKU",
    },
    {
      accessorKey: "tracked",
      header: "Tracked",
    },
    {
      accessorKey: "available",
      header: "Available",
    },
    {
      accessorKey: "cost",
      header: "Cost",
    },
  ],

  setModel(model) {
    const currentModel = get().model;
    const newModel = model || get().default;
    if (JSON.stringify(currentModel) !== JSON.stringify(newModel)) {
      set({ model: newModel });
    }
  },

  CreateInventoryItem: async (token, payload) => {
    set({ loading: true });
    try {
      const response = await fetchServer(token, urlBuilder('/inventory-item'), {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      return response;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  GetListInventoryItem: async (token) => {
    try {
      set({ loading: true });
      const response = await fetchServer(token, urlBuilder('/inventory-item'), {
        method: 'GET',
      });

      const data = response.data;
      console.log(data);

      set({ list: data?.data || [] });
      return data;
    } catch (error) {
      console.error('Error getting list of inventory items:', error);
      return error;
    } finally {
      set({ loading: false });
    }
  }
}));

// Legacy hooks for backward compatibility
export function useGetAllInventoryItem() {
  const { list, loading, GetListInventoryItem } = useInventoryItemStore();

  return {
    data: list,
    isLoading: loading,
    refetch: () => GetListInventoryItem(localStorage.getItem('auth_token') || ''),
  };
}

export function useCreateInventoryItem() {
  const { CreateInventoryItem, loading } = useInventoryItemStore();

  return {
    mutateAsync: (itemData: InventoryItemRequest) => CreateInventoryItem(localStorage.getItem('auth_token') || '', itemData),
    isPending: loading,
  };
}
