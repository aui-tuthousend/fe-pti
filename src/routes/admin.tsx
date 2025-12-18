import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { checkAuth } from './login/-server'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    const auth = await checkAuth()
    if (!auth.user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
          error: 'unauthorized',
        },
      })
    }
    return { auth }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex-1 p-6">
      <Outlet />
    </main>
  )
}
