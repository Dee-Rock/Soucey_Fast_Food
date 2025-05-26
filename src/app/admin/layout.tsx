"use client"

import { useState } from 'react'
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

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Restaurants', href: '/admin/restaurants', icon: Store },
    { name: 'Menu Items', href: '/admin/menu-items', icon: UtensilsCrossed },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center p-4 bg-white shadow-sm">
        <button
          type="button"
          className="p-2 text-gray-500 rounded-md lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 flex justify-center">
          <h1 className="text-xl font-semibold text-pink-600">Soucey Admin</h1>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden bg-gray-900/80 backdrop-blur-sm transition-opacity duration-300",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h2 className="text-xl font-semibold text-pink-600">Soucey Admin</h2>
          <button
            type="button"
            className="p-2 text-gray-500 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex flex-col h-full py-6 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-pink-50 text-pink-600"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b">
            <h2 className="text-xl font-semibold text-pink-600">Soucey Admin</h2>
          </div>
          <nav className="flex flex-col flex-1 py-6 px-3 overflow-y-auto">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      pathname === item.href
                        ? "bg-pink-50 text-pink-600"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pt-16 lg:pt-0">
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
