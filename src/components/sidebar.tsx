import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { 
  Home,
  ShoppingBag,
  Heart,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Package,
  Truck,
  Star,
  Gift,
  Tag,
  X,
  ChevronRight,
  ChevronDown
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const menuItems = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/',
      badge: null as string | null
    },
    {
      label: 'Shop',
      icon: ShoppingBag,
      href: '/',
      badge: null as string | null,
      submenu: [
        { label: 'All Products', href: '/' },
        { label: 'New Arrivals', href: '/' },
        { label: 'Best Sellers', href: '/' },
        { label: 'Sale Items', href: '/' }
      ]
    },
    {
      label: 'Categories',
      icon: Package,
      href: '/',
      badge: null as string | null,
      submenu: [
        { label: 'Hijab Segi Empat', href: '/' },
        { label: 'Hijab Pashmina', href: '/' },
        { label: 'Hijab Bergo', href: '/' },
        { label: 'Hijab Syari', href: '/' },
        { label: 'Accessories', href: '/' }
      ]
    },
    {
      label: 'My Orders',
      icon: Truck,
      href: '/',
      badge: '3' as string | null
    },
    {
      label: 'Wishlist',
      icon: Heart,
      href: '/',
      badge: '12' as string | null
    },
    {
      label: 'Reviews',
      icon: Star,
      href: '/',
      badge: null as string | null
    },
    {
      label: 'Rewards',
      icon: Gift,
      href: '/',
      badge: 'New' as string | null
    },
    {
      label: 'Coupons',
      icon: Tag,
      href: '/',
      badge: '5' as string | null
    }
  ]

  const accountItems = [
    {
      label: 'Profile',
      icon: User,
      href: '/'
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/'
    },
    {
      label: 'Help & Support',
      icon: HelpCircle,
      href: '/'
    }
  ]

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-card border-r border-border shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">HijabStore</h2>
              <p className="text-xs text-muted-foreground">Fashion & Style</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-foreground hover:bg-accent"
          >
            <X size={20} />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="text-primary-foreground" size={20} />
            </div>
            <div>
              <p className="font-medium text-foreground">Siti Aisyah</p>
              <p className="text-sm text-muted-foreground">Premium Member</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSection(item.label)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {expandedSections[item.label] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                    </button>
                    
                    {expandedSections[item.label] && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            onClick={onClose}
                            className="block px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Account Section */}
          <div className="mt-6 pt-4 px-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-3">
              ACCOUNT
            </h3>
            <div className="space-y-1">
              {accountItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </aside>
    </>
  )
}