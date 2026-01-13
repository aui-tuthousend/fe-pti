import { createServerFn } from '@tanstack/react-start'
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
