import { createServerFn } from '@tanstack/react-start'
import { API_BASE_URL } from '@/config/env'
import { fetchServer } from '@/lib/fetchServer'
import { urlBuilder } from '@/lib/utils'

export const listCustomerFn = createServerFn({ method: 'GET' })
  .inputValidator((data: string) => data)
  .handler(async ({data}: {data: string}) => {
    const response = await fetchServer(data, urlBuilder('/users'), {
      method: 'GET',
    });
    return response
  })
