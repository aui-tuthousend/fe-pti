import { createOrderFn, getUserOrdersFn, getAdminOrdersFn } from './-server'
import { CreateOrderRequest } from './-types'

export const orderService = {
  createOrder: async (data: CreateOrderRequest) => {
    return await createOrderFn({ data })
  },

  getUserOrders: async (token: string) => {
    return await getUserOrdersFn({ data: { token } })
  },

  getAdminOrders: async (token: string, page?: number, limit?: number) => {
    return await getAdminOrdersFn({ data: { token, page, limit } })
  },
}
