import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { checkAuth } from './login/-server'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin-sidebar'

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
    } else if (auth.user.role !== 'admin') {
      throw redirect({
        to: '/',
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
  const { auth } = Route.useRouteContext()

  return (
    <SidebarProvider>
      <AdminSidebar user={auth.user} />
      <main className="w-full">
        <div className="p-2">
          <SidebarTrigger />
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
