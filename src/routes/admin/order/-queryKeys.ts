export const orderKeys = {
  all: ['orders'] as const,
  create: () => [...orderKeys.all, 'create'] as const,
  userOrders: (token: string) => [...orderKeys.all, 'user', token] as const,
  adminOrders: (token: string, page?: number, limit?: number) =>
    [...orderKeys.all, 'admin', token, page, limit] as const,
}
