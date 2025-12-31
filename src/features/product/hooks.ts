import { create } from 'zustand';
import { useCookies } from 'react-cookie';
import { fetchServer } from '@/lib/fetchServer';
import { urlBuilder } from "@/lib/utils";
import type { ProductResponse, ProductRequest } from "./types";

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
  UpdateProduct: (token: string, uuid: string, payload: Partial<ProductRequest>) => Promise<any>;
  DeleteProduct: (token: string, uuid: string) => Promise<any>;
  UploadImage: (token: string, uuid: string, file: File) => Promise<any>;
  GetProductDetail: (uuid: string) => Promise<any>;
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
    variants: [],
    images: []
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
    variants: [],
    images: [] // images logic usually not in model for creation, but good to have consistency if Model can be Response
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
      const response = await fetchServer(token, urlBuilder('/products'), {
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

  UpdateProduct: async (token, uuid, payload) => {
    set({ loading: true });
    try {
      const response = await fetchServer(token, urlBuilder(`/products/${uuid}`), {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      // Update the product in the list if it exists
      const currentList = get().list;
      const updatedList = currentList.map(product =>
        product.uuid === uuid ? { ...product, ...response.data } : product
      );
      set({ list: updatedList });

      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  DeleteProduct: async (token, uuid) => {
    set({ loading: true });
    try {
      const response = await fetchServer(token, urlBuilder(`/products/${uuid}`), {
        method: 'DELETE',
      });

      // Remove the product from the list
      const currentList = get().list;
      const updatedList = currentList.filter(product => product.uuid !== uuid);
      set({ list: updatedList });

      return response;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  UploadImage: async (token, uuid, file) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append('image', file); // Changed from 'file' to 'image' assuming backend expects 'image'

      const response = await fetch(urlBuilder(`/products/${uuid}/images/upload`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        // Try to parse error message from backend
        const errorData = await response.json().catch(() => ({}));
        console.error("Upload Error Response:", errorData);
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  GetProductDetail: async (uuid) => {
    set({ loading: true });
    try {
      const response = await fetch(urlBuilder(`/products/${uuid}/detail`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Product detail response:', data);

      return data;
    } catch (error) {
      console.error('Error getting product detail:', error);
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

import { useEffect, useState } from 'react';

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

export function useUpdateProduct() {
  const [cookies] = useCookies(['authToken']);
  const { UpdateProduct, loading } = useProductStore();

  return {
    mutateAsync: (uuid: string, productData: Partial<ProductRequest>) =>
      UpdateProduct(cookies.authToken || '', uuid, productData),
    isPending: loading,
  };
}

export function useDeleteProduct() {
  const [cookies] = useCookies(['authToken']);
  const { DeleteProduct, loading } = useProductStore();

  return {
    mutateAsync: (uuid: string) => DeleteProduct(cookies.authToken || '', uuid),
    isPending: loading,
  };
}

export function useUploadProductImage() {
  const [cookies] = useCookies(['authToken']);
  const { UploadImage, loading } = useProductStore();

  return {
    mutateAsync: (uuid: string, file: File) => UploadImage(cookies.authToken || '', uuid, file),
    isPending: loading,
  };
}

export function useGetProductDetail(uuid: string) {
  const { GetProductDetail, loading } = useProductStore();
  const [product, setProduct] = useState<ProductResponse | null>(null);

  useEffect(() => {
    if (uuid) {
      GetProductDetail(uuid).then((data) => {
        setProduct(data.data);
      }).catch((error) => {
        console.error('Error fetching product detail:', error);
      });
    }
  }, [uuid, GetProductDetail]);

  return {
    data: product,
    isLoading: loading,
    refetch: () => GetProductDetail(uuid),
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

