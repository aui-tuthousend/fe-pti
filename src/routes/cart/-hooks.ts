import { useQuery } from '@tanstack/react-query'
import { getCartFn } from './-server'
import { CartResponse } from './-types'

export const useGetCart = (token: string | null) => {
  return useQuery<CartResponse>({
    queryKey: ['cart', token],
    queryFn: async () => {
      if (!token) throw new Error('No token provided')
      const response = await getCartFn({ data: token })
      return response.data
    },
    enabled: !!token, // Only fetch when token exists
    staleTime: 30000, // 30 seconds
  })
}
