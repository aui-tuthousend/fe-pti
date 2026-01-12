import { createServerFn } from '@tanstack/react-start'
import { fetchServer } from '@/lib/fetchServer'
import { urlBuilder } from '@/lib/utils'

type RegisterInput = {
  name: string
  email: string
  phone: string
  password: string
  role: string
}

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: RegisterInput) => data)
  .handler(async ({ data }: { data: RegisterInput }) => {
    try {
      await fetchServer('', urlBuilder('/users'), {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return { success: true }
    } catch (error) {
      console.error('Register Error:', error)
      throw error
    }
  })