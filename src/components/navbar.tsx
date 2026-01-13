import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import {
  Search,
  ShoppingCart,
  User,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Settings,
  UserCircle
} from 'lucide-react'


import { useQuery, useQueryClient } from '@tanstack/react-query'
import { checkAuth, logoutFn } from '@/routes/login/-server'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: auth } = useQuery({
    queryKey: ['auth'],
    queryFn: () => checkAuth(),
  })

  const user = auth?.user
  const isLoggedIn = !!user
  const userAvatar = '/user/arimbilogo.png'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogin = () => {
    setIsDropdownOpen(false)
    navigate({ to: '/login' })
  }

  const handleLogout = async () => {
    await logoutFn()
    await queryClient.invalidateQueries({ queryKey: ['auth'] })
    setIsDropdownOpen(false)
    navigate({ to: '/' })
  }

  return (
    <nav className="bg-background border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left Section */}
          <div className="flex items-center gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src="../user/arimbilogo.png" alt="ArimbiStore Logo" />
              </div>
              <span className="text-xl font-bold text-primary hidden sm:block">
                ArimbiStore
              </span>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-primary rounded-lg pl-10 pr-4 py-2 text-primary placeholder:text-primary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-primary hover:bg-primary/10"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <Sun
                className="h-5 w-5 transition-all duration-300"
                style={{
                  transform: theme === 'dark' ? 'rotate(-90deg) scale(0)' : 'rotate(0deg) scale(1)',
                  opacity: theme === 'dark' ? 0 : 1,
                }}
              />
              <Moon
                className="absolute h-5 w-5 transition-all duration-300"
                style={{
                  transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
                  opacity: theme === 'dark' ? 1 : 0,
                }}
              />
            </Button>

            {/* Notifications */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:bg-primary/10 relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                22
              </span>
            </Button> */}

            {/* Shopping Cart */}
            <Link to={isLoggedIn ? "/cart" : "/login"}>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-primary/10 relative cursor-pointer"
              >
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {/* {cart?.length} */}
                </span>
              </Button>
            </Link>

            {/* dropdown auth */}
            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="relative ml-1" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-primary hover:bg-primary/30 flex items-center gap-2 h-10 px-3 rounded-lg border border-primary hover:border-primary transition-all"
                >
                  <img
                    src={userAvatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="hidden sm:block text-primary font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={16} className="hidden sm:block text-primary" />
                </Button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-card border border-primary rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-border">
                        <div className="flex items-center gap-3">
                          <img
                            src={userAvatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-primary">{user.name}</p>
                            <p className="text-xs text-primary">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false)
                            // Navigate to profile page
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors w-full text-left"
                        >
                          <UserCircle size={16} />
                          Profile
                        </button>

                        <button
                          onClick={() => {
                            setIsDropdownOpen(false)
                            navigate({ to: '/order' })
                            // Navigate to orders page
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors w-full text-left"
                        >
                          <ShoppingCart size={16} />
                          My Orders
                        </button>

                        <div className="border-t border-border my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="text-primary hover:bg-primary/30 flex items-center gap-2 h-10 px-3 rounded-lg border border-primary hover:border-primary transition-all ml-1"
              >
                <User size={20} className="text-primary" />
                <span className="hidden sm:block text-primary font-medium">Masuk</span>
              </Button>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-primary rounded-lg pl-10 pr-4 py-2 text-primary placeholder:text-primary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
    </nav>
  )
}