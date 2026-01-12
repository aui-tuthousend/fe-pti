import { createServerFn } from '@tanstack/react-start'
import { fetchServer } from '@/lib/fetchServer'
import { urlBuilder } from '@/lib/utils'
import { AddToCartRequest, UpdateCartItemRequest } from './-types';

export const getCartFn = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }: { data: string }) => {
    try {
      const response = await fetchServer(data, urlBuilder(`/cart`), {
        method: 'GET',
      });

      return response.data
    } catch (error) {
      console.error('Get cart Error:', error)
      throw error
    }
  })

export const inputCartFn = createServerFn({ method: 'POST' })
  .inputValidator((data: AddToCartRequest) => data)
  .handler(async ({ data }: { data: AddToCartRequest }) => {
    try {
      await fetchServer(data.token, urlBuilder(`/cart/items`), {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return { success: true }
    } catch (error) {
      console.error('Add to cart Error:', error)
      throw error
    }
  })

export const updateCartFn = createServerFn({ method: 'POST' })
  .inputValidator((data: UpdateCartItemRequest) => data)
  .handler(async ({ data }: { data: UpdateCartItemRequest }) => {
    try {
      await fetchServer(data.token, urlBuilder(`/cart/items`), {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      return { success: true }
    } catch (error) {
      console.error('Update cart Error:', error)
      throw error
    }
  })

export const deleteCartItemFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { uuid: string; token: string }) => data)
  .handler(async ({ data }: { data: { uuid: string; token: string } }) => {
    try {
      await fetchServer(data.token, urlBuilder(`/cart/items/${data.uuid}`), {
        method: 'DELETE',
      });

      return { success: true }
    } catch (error) {
      console.error('Delete cart item Error:', error)
      throw error
    }
  })
