import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from './-utils'
import { fetchServer } from '@/lib/fetchServer'
import { urlBuilder } from '@/lib/utils'

export type LoginInput = {
  email: string
  password: string
}

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: LoginInput) => data)
  .handler(async ({ data }: { data: LoginInput }) => {
    try {
      const response = await fetchServer('', urlBuilder('/users/login'), {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const session = await useAppSession()
      await session.update({
        user: response.data.data,
      })

      return { success: true, user: response.data.data }
    } catch (error) {
      console.error('Login Error:', error)
      throw error
    }
  })

export const checkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await useAppSession()
  return session.data
})

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  await session.clear()
  return { success: true }
})
