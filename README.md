# FE-PTI - E-Commerce Frontend Application

> Modern e-commerce frontend built with React 19, TanStack Router, and Tailwind CSS

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-Latest-black.svg)](https://bun.sh/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-1.130.2-orange.svg)](https://tanstack.com/router)

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed on your system

### Installation & Development

```bash
# Install dependencies
bun install

# Start development server (runs on http://localhost:3000)
bun run dev

# Build for production
bun run build

# Preview production build
bun run serve

# Run tests
bun run test
```

## 📖 Documentation

For comprehensive documentation about the project architecture, features, and development workflow, see [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md).

## 🎯 Key Features

- 🛍️ **E-Commerce Frontend** - Product catalog, shopping cart, checkout
- 👨‍💼 **Admin Panel** - Product & inventory management
- 🔐 **Authentication** - JWT-based login/register system
- 🌓 **Theme Support** - Dark/Light mode with persistent preferences
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Fast & Modern** - Built with latest React 19 and Vite

## 🏗️ Tech Stack

- **Frontend Framework:** React 19
- **Routing:** TanStack Router (file-based)
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS v4
- **Type Safety:** TypeScript
- **Build Tool:** Vite
- **Runtime:** Bun
- **Testing:** Vitest + Testing Library
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** Zustand + React Query

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── routes/          # File-based routing
├── features/        # Feature modules (product, user, etc.)
├── lib/             # Utility libraries
├── config/          # Configuration files
└── styles/          # Global styles
```

## 🔌 API Configuration

Set your API endpoint in `.env`:

```bash
VITE_API_URL=http://localhost:4000
VITE_SESSION_SECRET=your-secret-key
```

## 🛣️ Routes

- `/` - Homepage
- `/catalog` - Product catalog
- `/catalog/:productId` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/login` - User login
- `/register` - User registration
- `/admin` - Admin dashboard (protected)
- `/admin/product` - Product management (protected)

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) for testing:

```bash
bun run test
```

## 📝 Development Notes

- Uses **file-based routing** - add files in `src/routes/` to create new routes
- **SSR-ready** with TanStack Start
- **Type-safe** end-to-end with TypeScript
- Automatic route generation via `routeTree.gen.ts`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of an academic assignment (Proyek Teknologi Informasi).

## 🔗 Resources

- [TanStack Router Documentation](https://tanstack.com/router)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Bun Documentation](https://bun.sh)
- [React Documentation](https://react.dev)

---

**Built with ❤️ using modern web technologies**
