import { createServerFn } from '@tanstack/react-start'

export const proxyImageFn = createServerFn({ method: 'POST' })
    .inputValidator((data: { url: string }) => data)
    .handler(async ({ data }: { data: { url: string } }) => {
        try {
            const response = await fetch(data.url, {
                // @ts-ignore - Bun/Node specific non-standard option for loose SSL
                tls: { rejectUnauthorized: false }
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`)
            }

            const contentType = response.headers.get('content-type') || 'application/octet-stream'
            const arrayBuffer = await response.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer).toString('base64')

            return {
                success: true,
                data: {
                    contentType,
                    buffer
                }
            }
        } catch (error: any) {
            console.error('Proxy Image Error:', error)
            throw new Error(error.message || 'Failed to proxy image')
        }
    })
