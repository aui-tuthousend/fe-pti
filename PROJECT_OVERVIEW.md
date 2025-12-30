# 📚 Dokumentasi Project FE-PTI

## 🎯 Ringkasan Project

**FE-PTI** adalah aplikasi e-commerce frontend yang dibangun menggunakan modern React stack dengan TanStack Router dan React Query. Project ini menggunakan Bun sebagai runtime dan package manager, dengan Vite sebagai build tool.

---

## 🏗️ Arsitektur & Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0.0 | UI Framework |
| **TypeScript** | 5.7.2 | Type Safety |
| **Bun** | Latest | Runtime & Package Manager |
| **Vite** | 7.1.7 | Build Tool & Dev Server |

### Key Libraries

#### Routing & Data Fetching
- **@tanstack/react-router** (1.130.2) - File-based routing dengan type-safe navigation
- **@tanstack/react-query** (5.66.5) - Server state management & data fetching
- **@tanstack/react-start** (1.131.7) - SSR integration untuk TanStack Router

#### UI & Styling
- **Tailwind CSS** (4.1.14) - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** (0.544.0) - Icon library
- **class-variance-authority** - Component variant management
- **next-themes** (0.4.6) - Dark/light theme support
- **sonner** (2.0.7) - Toast notifications

#### State Management
- **Zustand** (5.0.8) - Lightweight state management
- **react-cookie** (8.0.1) - Cookie management

#### Validation & Utils
- **Zod** (4.1.12) - Schema validation
- **clsx** & **tailwind-merge** - Conditional className utilities

#### Testing
- **Vitest** (3.0.5) - Unit testing framework
- **@testing-library/react** (16.2.0) - Component testing
- **jsdom** (27.0.0) - DOM simulation

---

## 📁 Struktur Project

```
fe-pti/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx      # Main header component
│   │   ├── navbar.tsx      # Navigation bar
│   │   ├── sidebar.tsx     # Sidebar navigation
│   │   └── theme-provider.tsx
│   │
│   ├── routes/             # File-based routing
│   │   ├── __root.tsx      # Root layout
│   │   ├── index.tsx       # Homepage
│   │   ├── admin/          # Admin routes
│   │   │   ├── index.tsx
│   │   │   └── product/
│   │   ├── catalog/        # Product catalog
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout flow
│   │   ├── login/          # Authentication
│   │   └── register/       # User registration
│   │
│   ├── features/           # Feature modules
│   │   ├── product/        # Product management
│   │   │   ├── hooks.ts    # React Query hooks
│   │   │   ├── service.ts  # API service layer
│   │   │   └── types.ts    # TypeScript types
│   │   ├── user/           # User management
│   │   ├── variant/        # Product variants
│   │   └── inventory-item/ # Inventory management
│   │
│   ├── integrations/       # Third-party integrations
│   │   └── tanstack-query/ # React Query setup
│   │
│   ├── lib/                # Utility libraries
│   │   ├── fetchServer.ts  # API fetch wrapper
│   │   └── utils.ts        # Helper functions
│   │
│   ├── config/             # Configuration
│   │   └── env.ts          # Environment variables
│   │
│   ├── styles/             # Global styles
│   │   └── app.css         # Main stylesheet
│   │
│   ├── router.tsx          # Router configuration
│   └── routeTree.gen.ts    # Generated route tree
│
├── public/                 # Static assets
├── .vscode/               # VS Code settings
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎨 Fitur Utama

### 1. **E-Commerce Frontend**
- 🏠 Homepage dengan product showcase
- 📦 Product catalog dengan pagination
- 🛒 Shopping cart functionality
- 💳 Checkout process
- ⭐ Product reviews & ratings
- ❤️ Wishlist functionality

### 2. **Admin Panel**
- 📊 Product management (CRUD operations)
- 🏷️ Variant management
- 📦 Inventory tracking
- 👥 User management

### 3. **Authentication & Authorization**
- 🔐 Login/Register system
- 🔑 JWT token-based authentication
- 🛡️ Protected routes (admin area)
- 🍪 Cookie-based session management

### 4. **UI/UX Features**
- 🌓 Dark/Light theme toggle
- 📱 Responsive design
- 🎨 Modern UI dengan Tailwind CSS
- 🔔 Toast notifications
- ⚡ Fast navigation dengan SPA routing

---

## 🔌 API Integration

### Base Configuration
```typescript
// src/config/env.ts
API_BASE_URL: http://localhost:4000 (default)
SESSION_SECRET: Configurable via env
```

### Fetch Wrapper
```typescript
// src/lib/fetchServer.ts
- Automatic JWT token injection
- JSON content-type headers
- Error handling
```

### Data Models

#### Product
```typescript
interface ProductResponse {
  uuid: string;
  title: string;
  description: string;
  product_type: string;
  vendor: string;
  tags: string[];
  status: string;
  published_at: Date | null;
  variants: Variant[];
}
```

#### Variant
```typescript
interface Variant {
  uuid: string;
  title: string;
  price: number;
  sku: string;
  inventory_quantity: number;
  inventory_policy: string;
  option1: string;
  inventory_item?: InventoryItem;
}
```

#### User
```typescript
interface UserResponse {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface LoginUserResponse extends UserResponse {
  token: string;
}
```

---

## 🛣️ Routing System

### File-Based Routing
Project menggunakan TanStack Router dengan file-based routing:

- **`__root.tsx`** - Root layout dengan theme provider
- **`index.tsx`** - Homepage
- **`admin.tsx`** - Admin layout dengan auth guard
- **`admin/product/index.tsx`** - Product management
- **`catalog/$productId.tsx`** - Dynamic product detail
- **`login/index.tsx`** - Login page
- **`register/index.tsx`** - Registration page

### Protected Routes
```typescript
// admin.tsx - Route guard example
beforeLoad: async ({ location }) => {
  const auth = await checkAuth()
  if (!auth.user) {
    throw redirect({ to: '/login' })
  }
}
```

---

## 🔄 State Management

### React Query (Server State)
- Product fetching & caching
- User authentication state
- Optimistic updates
- Automatic refetching

### Zustand (Client State)
- Available untuk local state management
- Lightweight & simple API

### Cookies
- Session management
- Authentication token storage

---

## 🎨 Styling System

### Tailwind CSS v4
- Utility-first approach
- Custom design system
- Dark mode support
- Responsive breakpoints

### Component Variants
```typescript
// Using class-variance-authority
const buttonVariants = cva(...)
```

### Theme System
- Light/Dark mode toggle
- Persistent theme preference (localStorage)
- System preference detection
- Smooth theme transitions

---

## 🧪 Testing

### Test Framework
```bash
bun run test  # Run Vitest tests
```

### Testing Tools
- **Vitest** - Fast unit test runner
- **@testing-library/react** - Component testing
- **jsdom** - DOM simulation

---

## 🚀 Development Workflow

### Installation
```bash
bun install
```

### Development Server
```bash
bun run dev
# Runs on http://localhost:3000
```

### Build for Production
```bash
bun run build
```

### Preview Production Build
```bash
bun run serve
```

---

## 🔧 Configuration Files

### Vite Config
```typescript
// vite.config.ts
- TanStack Start plugin
- Tailwind CSS integration
- TypeScript path aliases
- Nitro V2 plugin for SSR
```

### TypeScript Config
```typescript
// tsconfig.json
- Strict mode enabled
- Path aliases: @/* → ./src/*
- React JSX support
- ES2022 target
```

---

## 📦 Key Dependencies Explained

### TanStack Ecosystem
- **Router** - Type-safe routing dengan file-based system
- **Query** - Server state management
- **Start** - SSR & full-stack capabilities
- **Devtools** - Development debugging tools

### UI Components
- **Radix UI** - Headless accessible components
- **Lucide** - Modern icon library
- **Sonner** - Beautiful toast notifications

### Developer Experience
- **Bun** - Fast runtime & package manager
- **Vite** - Lightning-fast HMR
- **TypeScript** - Type safety
- **Vitest** - Fast testing

---

## 🎯 Best Practices

### Code Organization
✅ Feature-based folder structure  
✅ Separation of concerns (hooks, services, types)  
✅ Reusable UI components  
✅ Type-safe API calls  

### Performance
✅ React Query caching  
✅ Code splitting via routing  
✅ Lazy loading  
✅ Optimistic updates  

### Type Safety
✅ Strict TypeScript mode  
✅ Zod schema validation  
✅ Type-safe routing  
✅ API response typing  

---

## 🔐 Environment Variables

```bash
# .env (create this file)
VITE_API_URL=http://localhost:4000
VITE_SESSION_SECRET=your-secret-key
```

---

## 📝 Notes

- Project menggunakan **Bun** sebagai runtime, bukan Node.js
- Routing menggunakan **file-based system** - tambah file di `src/routes/` untuk route baru
- **SSR-ready** dengan TanStack Start
- **Type-safe** end-to-end dengan TypeScript
- **Modern React 19** dengan concurrent features

---

## 🔗 Useful Links

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Bun Documentation](https://bun.sh)
- [Vite Documentation](https://vitejs.dev)

---

**Last Updated:** December 2024  
**Project Type:** E-Commerce Frontend Application  
**Status:** Active Development
