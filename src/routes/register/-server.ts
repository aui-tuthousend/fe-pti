import { createServerFn } from '@tanstack/react-start'
import { API_BASE_URL } from '@/config/env'

type RegisterInput = {
  username: string
  password: string
  name: string
  email: string
  phone: string
  role: string
}

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: RegisterInput) => data)
  .handler(async ({ data }: { data: RegisterInput }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
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
            `Register failed with status ${response.status}`,
        )
      }

      const result = await response.json()

      console.log('Register result:', result)

      return { success: true }
    } catch (error) {
      // Re-throw so the client sees the error
      console.error('Register Error:', error)
      throw error
    }
  })