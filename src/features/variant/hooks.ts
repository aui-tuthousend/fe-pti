import { create } from 'zustand';
import { checkAuth } from '@/routes/login/-server';
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
    productId: "", // Added as it is required in Request
    uuid: "",
    title: "",
    price: 0,
    sku: "",
    available: 0,
    cost: 0,
    inventory_policy: "",
    option1: "",
    created_at: new Date(),
    updated_at: new Date(),
  } as any, // Cast to any or partial because Variant/Request mismatch on some fields
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
      const response = await fetchServer(token, urlBuilder('/variants'), {
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
      const response = await fetchServer(token, urlBuilder('/variants'), {
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
    refetch: async () => {
      const session = await checkAuth();
      const token = session?.user?.token || '';
      return GetListVariant(token);
    },
  };
}

// Helper function to upload variant image
export async function uploadVariantImage(
  token: string,
  variantUuid: string,
  file: File,
  alt_text?: string,
  position?: number
): Promise<{ url: string; alt_text?: string; position?: number }> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    if (alt_text) formData.append('alt_text', alt_text);
    if (position !== undefined && !isNaN(position)) formData.append('position', position.toString());

    const response = await fetch(urlBuilder(`/variants/${variantUuid}/images/upload`), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Variant image upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.message || errorData.errors || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      url: data.data.url,
      alt_text: data.data.alt_text,
      position: data.data.position,
    };
  } catch (error) {
    console.error('Error uploading variant image:', error);
    throw error;
  }
}

export function useCreateVariant() {
  const { CreateVariant, loading } = useVariantStore();

  return {
    mutateAsync: async (variantData: VariantRequest) => {
      const session = await checkAuth();
      const token = session?.user?.token || '';
      return CreateVariant(token, variantData);
    },
    isPending: loading,
  };
}
