'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CreditCard, 
  Users, 
  Store, 
  UtensilsCrossed,
  BarChart,
  Settings,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Menu Items', href: '/admin/menu-items', icon: UtensilsCrossed },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Restaurants', href: '/admin/restaurants', icon: Store },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <button
          type="button"
          className="fixed right-4 top-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        {/* Mobile navigation overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        )}
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-center border-b px-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>

        <nav className="mt-5 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className={cn(
        'min-h-screen transition-all duration-200 ease-in-out',
        'lg:pl-64'  // Add padding for the sidebar on large screens
      )}>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
