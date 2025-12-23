import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/order/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/order/"!</div>
}
