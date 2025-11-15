import { create } from 'zustand';
import { fetchServer } from '@/lib/fetchServer';
import { urlBuilder } from "@/lib/utils";
import type { Variant, VariantRequest } from "./types";

interface VariantStore {
  list: Variant[];
  default: Variant;
  model: Variant | VariantRequest;
  loading: boolean;
  tableAttributes: Array<{
    accessorKey: string;
    header: string;
  }>;

  setModel: (model?: Variant | VariantRequest) => void;
  CreateVariant: (token: string, payload: VariantRequest) => Promise<any>;
  GetListVariant: (token: string) => Promise<any>;
}

export const useVariantStore = create<VariantStore>((set, get) => ({
  list: [],
  default: {
    uuid: "",
    title: "",
    price: 0,
    sku: "",
    inventory_quantity: 0,
    inventory_policy: "",
    option1: "",
    created_at: new Date(),
    updated_at: new Date(),
  },
  model: {
    uuid: "",
    title: "",
    price: 0,
    sku: "",
    inventory_quantity: 0,
    inventory_policy: "",
    option1: "",
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
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "sku",
      header: "SKU",
    },
    {
      accessorKey: "inventory_quantity",
      header: "Quantity",
    },
    {
      accessorKey: "option1",
      header: "Option",
    },
  ],

  setModel(model) {
    const currentModel = get().model;
    const newModel = model || get().default;
    if (JSON.stringify(currentModel) !== JSON.stringify(newModel)) {
      set({ model: newModel });
    }
  },

  CreateVariant: async (token, payload) => {
    set({ loading: true });
    try {
      const response = await fetchServer(token, urlBuilder('/variant'), {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      return response;
    } catch (error) {
      console.error('Error creating variant:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  GetListVariant: async (token) => {
    try {
      set({ loading: true });
      const response = await fetchServer(token, urlBuilder('/variant'), {
        method: 'GET',
      });

      const data = response.data;
      console.log(data);

      set({ list: data?.data || [] });
      return data;
    } catch (error) {
      console.error('Error getting list of variants:', error);
      return error;
    } finally {
      set({ loading: false });
    }
  }
}));

// Legacy hooks for backward compatibility
export function useGetAllVariant() {
  const { list, loading, GetListVariant } = useVariantStore();

  return {
    data: list,
    isLoading: loading,
    refetch: () => GetListVariant(localStorage.getItem('auth_token') || ''),
  };
}

export function useCreateVariant() {
  const { CreateVariant, loading } = useVariantStore();

  return {
    mutateAsync: (variantData: VariantRequest) => CreateVariant(localStorage.getItem('auth_token') || '', variantData),
    isPending: loading,
  };
}
