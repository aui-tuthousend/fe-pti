import { useMutation, useQuery } from '@tanstack/react-query'
import { orderService } from './-service'
import { CreateOrderRequest } from './-types'
import { orderKeys } from './-queryKeys'

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderService.createOrder(data),
  })
}

// Hook for fetching user's orders (regular users)
export const useGetUserOrders = (token: string | null) => {
  return useQuery({
    queryKey: orderKeys.userOrders(token ?? ''),
    queryFn: () => orderService.getUserOrders(token!),
    enabled: !!token, // Only run query if token exists
  })
}

// Hook for fetching all orders (admin)
export const useGetAdminOrders = (token: string | null, page?: number, limit?: number) => {
  return useQuery({
    queryKey: orderKeys.adminOrders(token ?? '', page, limit),
    queryFn: () => orderService.getAdminOrders(token!, page, limit),
    enabled: !!token, // Only run query if token exists
  })
}
