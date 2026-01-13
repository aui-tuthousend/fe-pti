import { createServerFn } from '@tanstack/react-start'
import { fetchServer } from '@/lib/fetchServer'
import { urlBuilder } from '@/lib/utils'
import { CreateOrderRequest, OrderResponse, GetAllOrdersResponse } from './-types';

// Create order
export const createOrderFn = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateOrderRequest) => data)
  .handler(async ({ data }: { data: CreateOrderRequest }) => {
    const response = await fetchServer(data.token, urlBuilder('/orders'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response
  })

// Get user's orders (for regular users)
export const getUserOrdersFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }: { data: { token: string } }): Promise<OrderResponse[]> => {
    const response = await fetchServer(data.token, urlBuilder('/orders'), {
      method: 'GET',
    });
    // Handle potential nested structure: { data: { data: [...] } } or { data: [...] }
    const result = response.data;
    return (Array.isArray(result) ? result : result?.data || []) as OrderResponse[]
  })

// Get all orders for admin with pagination
export const getAdminOrdersFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { token: string; page?: number; limit?: number }) => data)
  .handler(async ({ data }: { data: { token: string; page?: number; limit?: number } }): Promise<GetAllOrdersResponse> => {
    const params = new URLSearchParams();
    if (data.page) params.append('page', data.page.toString());
    if (data.limit) params.append('limit', data.limit.toString());

    const url = params.toString()
      ? urlBuilder(`/admin/orders?${params.toString()}`)
      : urlBuilder('/admin/orders');

    const response = await fetchServer(data.token, url, {
      method: 'GET',
    });
    // Handle potential nested structure
    const result = response.data;
    return (result?.data ? result : result) as GetAllOrdersResponse
  })