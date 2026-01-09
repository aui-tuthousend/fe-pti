import { createServerFn } from '@tanstack/react-start'

export const proxyImageFn = createServerFn({ method: 'POST' })
    .inputValidator((data: { url: string }) => data)
    .handler(async ({ data }: { data: { url: string } }) => {
        try {
            // Create an agent to ignore SSL errors (if environment allows or needed for specific problematic hosts)
            // Note: Native fetch in Node/Bun relies on global dispatcher or specific init options depending on version.
            // For Bun, we can't easily switch agent in standard fetch, but we can try just fetching.
            // If the error 'ERR_TLS_CERT_ALTNAME_INVALID' persists, it means the target server has a bad cert.
            // Users should ideally fix the target URL or we can try to be lenient if the runtime allows.

            // Re-attempt fetch with standard options (simple fetch)
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
