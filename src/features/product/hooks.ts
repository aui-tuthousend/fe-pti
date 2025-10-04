import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { productService } from './service';
import { ProductRequest } from './types';

export const productKeys = {
    all: ['product'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    infinite: () => [...productKeys.all, 'infinite'] as const,
}

export function useGetAllProduct() {
  return useQuery({
      queryKey: productKeys.lists(),
      queryFn: () => productService.getAllProduct(),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductRequest) => productService.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useGetInfiniteProducts(limit: number = 10) {
  return useInfiniteQuery({
    queryKey: productKeys.infinite(),
    queryFn: ({ pageParam = 1 }) => productService.getPaginatedProducts(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}