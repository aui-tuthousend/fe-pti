import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from './-utils'
import { API_BASE_URL } from '@/config/env'

export type LoginInput = {
  email: string
  password: string
}

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: LoginInput) => data)
  .handler(async ({ data }: { data: LoginInput }) => {
    try {
      // console.log(`Attempting login to: ${API_BASE_URL}/api/auth/login`)
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Backend login error:', response.status, errorData)
        throw new Error(
          errorData.message ||
            errorData.error ||
            `Login failed with status ${response.status}`,
        )
      }

      const result = await response.json()

      console.log('Login result:', result)

      // result should match { token: string, user: ... } based on user request
      if (!result.token || !result.user) {
        throw new Error('Invalid response from server')
      }

      const session = await useAppSession()
      await session.update({
        token: result.token,
        user: result.user,
      })

      return { success: true, user: result.user }
    } catch (error) {
      // Re-throw so the client sees the error
      console.error('Login Error:', error)
      throw error
    }
  })

export const checkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await useAppSession()

  // console.log("Session data:", session.data)
  return session.data
})

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  await session.clear()
  return { success: true }
})
