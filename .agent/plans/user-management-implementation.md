# User Management Implementation Plan

## 📋 Overview
Implement complete CRUD operations for user management at `/admin/customer` following the same pattern as product management.

## 🎯 Objectives
1. Create user list page with table view
2. Implement user CRUD operations (Create, Read, Update, Delete)
3. Add search and pagination
4. Follow existing design patterns from product management

## 📊 API Endpoints (from http://localhost:4000/docs)

### Available Endpoints:
- `POST /api/users` - Register new user (public)
- `POST /api/users/login` - Login user (public)
- Additional endpoints to be checked in API docs

### Expected User Fields:
```typescript
interface User {
  uuid: string
  email: string
  phone: string
  name: string
  role: string  // 'admin' | 'user'
  created_at: Date
  updated_at: Date
}

interface UserRequest {
  email: string
  phone: string
  password: string
  name: string
  role?: string
}
```

## 🏗️ File Structure

```
src/
├── features/
│   └── user/
│       ├── hooks.ts          # Zustand store & API calls
│       └── types.ts          # TypeScript interfaces
└── routes/
    └── admin/
        └── customer/
            ├── index.tsx     # Main customer list page
            └── -server.ts    # Server-side data fetching
```

## 📝 Implementation Steps

### Step 1: Create Type Definitions
**File**: `src/features/user/types.ts`

```typescript
export interface User {
  uuid: string
  email: string
  phone: string
  name: string
  role: string
  created_at: Date
  updated_at: Date
}

export interface UserRequest {
  email: string
  phone: string
  password: string
  name: string
  role?: string
}

export interface UserResponse {
  data: User
}

export interface PaginatedUsersResponse {
  data: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### Step 2: Create Zustand Store & API Hooks
**File**: `src/features/user/hooks.ts`

```typescript
import { create } from 'zustand'
import { fetchServer } from '@/lib/fetchServer'
import { urlBuilder } from '@/lib/utils'
import type { User, UserRequest, PaginatedUsersResponse } from './types'

interface UserStore {
  list: User[]
  model: User | UserRequest
  loading: boolean
  
  // Table columns configuration
  tableAttributes: Array<{
    accessorKey: string
    header: string
  }>
  
  // CRUD operations
  setModel: (model?: User | UserRequest) => void
  GetListUser: (token: string, page?: number, limit?: number) => Promise<PaginatedUsersResponse>
  GetUserDetail: (token: string, uuid: string) => Promise<User>
  CreateUser: (token: string, payload: UserRequest) => Promise<User>
  UpdateUser: (token: string, uuid: string, payload: Partial<UserRequest>) => Promise<User>
  DeleteUser: (token: string, uuid: string) => Promise<boolean>
}

export const useUserStore = create<UserStore>((set, get) => ({
  list: [],
  model: {
    email: '',
    phone: '',
    password: '',
    name: '',
    role: 'user'
  },
  loading: false,
  
  tableAttributes: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'created_at', header: 'Created At' }
  ],
  
  setModel: (model) => {
    set({ model: model || get().model })
  },
  
  GetListUser: async (token, page = 1, limit = 10) => {
    set({ loading: true })
    try {
      const response = await fetchServer(
        token,
        urlBuilder(`/users?page=${page}&limit=${limit}`),
        { method: 'GET' }
      )
      set({ list: response.data })
      return response
    } finally {
      set({ loading: false })
    }
  },
  
  GetUserDetail: async (token, uuid) => {
    set({ loading: true })
    try {
      const response = await fetchServer(
        token,
        urlBuilder(`/users/${uuid}`),
        { method: 'GET' }
      )
      return response.data
    } finally {
      set({ loading: false })
    }
  },
  
  CreateUser: async (token, payload) => {
    set({ loading: true })
    try {
      const response = await fetchServer(
        token,
        urlBuilder('/users'),
        {
          method: 'POST',
          body: JSON.stringify(payload)
        }
      )
      return response.data
    } finally {
      set({ loading: false })
    }
  },
  
  UpdateUser: async (token, uuid, payload) => {
    set({ loading: true })
    try {
      const response = await fetchServer(
        token,
        urlBuilder(`/users/${uuid}`),
        {
          method: 'PATCH',
          body: JSON.stringify(payload)
        }
      )
      
      // Update in list
      const currentList = get().list
      const updatedList = currentList.map(u =>
        u.uuid === uuid ? { ...u, ...response.data } : u
      )
      set({ list: updatedList })
      
      return response.data
    } finally {
      set({ loading: false })
    }
  },
  
  DeleteUser: async (token, uuid) => {
    set({ loading: true })
    try {
      await fetchServer(
        token,
        urlBuilder(`/users/${uuid}`),
        { method: 'DELETE' }
      )
      
      // Remove from list
      const currentList = get().list
      set({ list: currentList.filter(u => u.uuid !== uuid) })
      
      return true
    } finally {
      set({ loading: false })
    }
  }
}))

// React Query-like hooks
export function useGetUsers(page = 1, limit = 10) {
  const { GetListUser, list, loading } = useUserStore()
  
  return {
    data: list,
    isLoading: loading,
    refetch: async (token: string) => GetListUser(token, page, limit)
  }
}
```

### Step 3: Create Server-Side Data Fetching
**File**: `src/routes/admin/customer/-server.ts`

```typescript
import { createServerFn } from '@tanstack/start'
import { checkAuth } from '@/routes/login/-server'

export const GetUserList = createServerFn({ method: 'GET' })
  .handler(async () => {
    const session = await checkAuth()
    if (!session?.user?.token) {
      throw new Error('Unauthorized')
    }
    
    // Return auth for client-side usage
    return { auth: session }
  })
```

### Step 4: Create Main Customer Page
**File**: `src/routes/admin/customer/index.tsx`

Main features:
- User list table with pagination
- Create user modal
- Edit user modal
- Delete confirmation
- Search functionality
- Role filter (admin/user)

Key components:
```typescript
// Table columns
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'created_at', header: 'Created' },
  { accessorKey: 'actions', header: 'Actions' }
]

// User form fields
interface UserFormData {
  name: string
  email: string
  phone: string
  password: string
  role: 'admin' | 'user'
}
```

### Step 5: Create User Form Modal
Similar to ProductFormModal but simpler (no variants, no images):

```typescript
interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UserRequest) => Promise<void>
  user?: User  // For edit mode
  isLoading: boolean
}

function UserFormModal({ isOpen, onClose, onSubmit, user, isLoading }: UserFormModalProps) {
  // Form fields:
  // - Name (text input)
  // - Email (email input)
  // - Phone (tel input)
  // - Password (password input, required for create, optional for update)
  // - Role (select: admin/user)
}
```

## 🎨 UI/UX Considerations

### Design Pattern
Follow product management design:
- Same table layout
- Same modal design
- Same button styles
- Same color scheme

### User Experience
1. **Create User**:
   - Click "Add User" button
   - Fill form (name, email, phone, password, role)
   - Submit → User created → Modal closes → Table refreshes

2. **Edit User**:
   - Click edit icon on user row
   - Form pre-filled with user data
   - Password field optional (only if changing password)
   - Submit → User updated → Modal closes → Table refreshes

3. **Delete User**:
   - Click delete icon
   - Confirmation dialog
   - Confirm → User deleted → Table refreshes

4. **Search & Filter**:
   - Search by name/email
   - Filter by role (All/Admin/User)
   - Pagination controls

## 🔒 Security Considerations

1. **Authentication**: All operations require valid auth token
2. **Role-based Access**: Only admins can access `/admin/customer`
3. **Password Handling**:
   - Never display passwords
   - Hash on backend
   - Optional on update (only if changing)

## ✅ Acceptance Criteria

- [ ] User list displays with pagination
- [ ] Create user functionality works
- [ ] Edit user functionality works
- [ ] Delete user functionality works
- [ ] Search users by name/email works
- [ ] Filter users by role works
- [ ] Form validation works (email format, phone format, required fields)
- [ ] Error handling with toast notifications
- [ ] Loading states displayed properly
- [ ] Responsive design matches product management
- [ ] All CRUD operations persist to backend

## 🚀 Next Steps After Implementation

1. Add user activity logs
2. Add user permissions management
3. Add bulk operations (bulk delete, bulk role change)
4. Add export users to CSV
5. Add user statistics dashboard
