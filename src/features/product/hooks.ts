import { create } from 'zustand';
import { useCookies } from 'react-cookie';
import { fetchServer } from '@/lib/fetchServer';
import { urlBuilder } from "@/lib/utils";
import type { ProductResponse, ProductRequest, PaginatedProductsResponse } from "./types";

interface ProductStore {
  list: ProductResponse[];
  default: ProductResponse;
  model: ProductResponse | ProductRequest;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  tableAttributes: Array<{
    accessorKey: string;
    header: string;
  }>;

  setModel: (model?: ProductResponse | ProductRequest) => void;
  CreateProduct: (token: string, payload: ProductRequest) => Promise<any>;
  GetListProduct: (token: string) => Promise<any>;
  GetPaginatedProducts: (token: string, page?: number, limit?: number) => Promise<any>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  list: [],
  default: {
    uuid: "",
    title: "",
    description: "",
    product_type: "",
    vendor: "",
    tags: [],
    status: "",
    published_at: null,
    created_at: new Date(),
    updated_at: new Date(),
    variants: []
  },
  model: {
    uuid: "",
    title: "",
    description: "",
    product_type: "",
    vendor: "",
    tags: [],
    status: "",
    published_at: null,
    created_at: new Date(),
    updated_at: new Date(),
    variants: []
  },
  loading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
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
      accessorKey: "product_type",
      header: "Type",
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ],

  setModel(model) {
    const currentModel = get().model;
    const newModel = model || get().default;
    if (JSON.stringify(currentModel) !== JSON.stringify(newModel)) {
      set({ model: newModel });
    }
  },

  CreateProduct: async (token, payload) => {
    set({ loading: true });
    try {
      const response = await fetchServer(token, urlBuilder('/product'), {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  GetListProduct: async (token) => {
    try {
      set({ loading: true });
      // GET requests don't need authentication for products
      const response = await fetch(urlBuilder('/products'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Products response:', data);

      set({ list: data?.data || [] });
      return data;
    } catch (error) {
      console.error('Error getting list of products:', error);
      return error;
    } finally {
      set({ loading: false });
    }
  },

  GetPaginatedProducts: async (token, page = 1, limit = 10) => {
    try {
      set({ loading: true });
      // GET requests don't need authentication for products
      const response = await fetch(`${urlBuilder('/products')}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log("Paginated products response:", data);

      set({
        list: data?.data || [],
        pagination: data?.pagination || get().pagination
      });
      return data;
    } catch (error) {
      console.error('Error getting paginated products:', error);
      return error;
    } finally {
      set({ loading: false });
    }
  }
}));

import { useEffect } from 'react';

// Legacy hooks for backward compatibility
export function useGetAllProduct() {
  const { list, loading, GetListProduct } = useProductStore();

  // Auto-fetch products on mount if list is empty
  useEffect(() => {
    if (list.length === 0) {
      GetListProduct(''); // No token needed for GET requests
    }
  }, [list.length, GetListProduct]);

  return {
    data: list,
    isLoading: loading,
    refetch: () => GetListProduct(''),
  };
}

export function useCreateProduct() {
  const [cookies] = useCookies(['authToken']);
  const { CreateProduct, loading } = useProductStore();

  return {
    mutateAsync: (productData: ProductRequest) => CreateProduct(cookies.authToken || '', productData),
    isPending: loading,
  };
}

export function useGetInfiniteProducts(limit: number = 10) {
  const [cookies] = useCookies(['authToken']);
  const { list, loading, pagination, GetPaginatedProducts } = useProductStore();

  return {
    data: {
      pages: [{ data: list, pagination }],
      pageParams: [1],
    },
    isLoading: loading,
    fetchNextPage: ({ pageParam = pagination.page + 1 }) =>
      GetPaginatedProducts(cookies.authToken || '', pageParam, limit),
    hasNextPage: pagination.page < pagination.totalPages,
  };
}
