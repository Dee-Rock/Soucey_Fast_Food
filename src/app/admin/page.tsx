"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ShoppingBag, 
  CreditCard, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Store,
  UtensilsCrossed,
  Download,
  FileText,
  Loader,
  ArrowRight,
  Package
} from 'lucide-react'
import Link from 'next/link'
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data'
import { IOrder as Order } from '@/models/Order'

// Define the stats type
interface Stat {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  href: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('last_7_days')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch dashboard stats
        const statsResponse = await fetch('/api/admin/dashboard/stats')
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch dashboard stats')
        }
        const dashboardStats = await statsResponse.json()
        
        // Format stats for display
        const formatTrend = (value: number) => (value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`);
        
        setStats([
          {
            name: 'Total Orders',
            value: dashboardStats.totalOrders.toLocaleString(),
            change: formatTrend(dashboardStats.orderTrend),
            trend: dashboardStats.orderTrend >= 0 ? 'up' : 'down',
            icon: ShoppingBag,
            href: '/admin/orders'
          },
          {
            name: 'Total Revenue',
            value: `GH₵${dashboardStats.totalRevenue.toLocaleString()}`,
            change: formatTrend(dashboardStats.revenueTrend),
            trend: dashboardStats.revenueTrend >= 0 ? 'up' : 'down',
            icon: CreditCard,
            href: '/admin/orders'
          },
          {
            name: 'Total Users',
            value: dashboardStats.totalUsers.toLocaleString(),
            change: formatTrend(5.2), // Example trend
            trend: 'up',
            icon: Users,
            href: '/admin/users'
          },
          {
            name: 'Menu Items',
            value: dashboardStats.totalMenuItems.toLocaleString(),
            change: formatTrend(-1.8), // Example trend
            trend: 'down',
            icon: UtensilsCrossed,
            href: '/admin/menu'
          }
        ])

        // Fetch recent orders
        const ordersResponse = await fetch('/api/admin/orders/recent')
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch recent orders')
        }
        const orders = await ordersResponse.json()
        setRecentOrders(orders)
        
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDashboardData()
  }, [timeRange])

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select 
            className="px-3 py-2 border rounded-md text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="all_time">All time</option>
          </select>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => exportToCSV([...stats, ...recentOrders], `soucey-dashboard-${getFormattedDate()}.csv`)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex-1 sm:flex-initial justify-center"
              disabled={isLoading || error !== null}
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>
            <button 
              onClick={() => exportToJSON({stats, recentOrders}, `soucey-dashboard-${getFormattedDate()}.json`)}
              disabled={isLoading || error !== null}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex-1 sm:flex-initial justify-center"
            >
              <FileText className="h-4 w-4 mr-1" />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="w-12 h-12 text-pink-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          {error}
        </div>
      )}
      
      {/* Stats Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href} className="block">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-pink-100 p-2 sm:p-3 rounded-full">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
                  </div>
                  <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-pink-600 hover:text-pink-800 text-sm font-medium flex items-center">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Items</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{order.id?.substring(0, 8)}...</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{order.customer}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{order.amount}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                          ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">{order.date}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        <div className="max-w-xs truncate">{order.items.map(item => item.name).join(', ')}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <Link 
            href="/admin/restaurants/new" 
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
          >
            <div className="text-center">
              <Store className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Add New Restaurant</span>
            </div>
          </Link>
          <Link 
            href="/admin/menu-items/new" 
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
          >
            <div className="text-center">
              <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Add New Menu Item</span>
            </div>
          </Link>
          <Link 
            href="/admin/settings/promotions" 
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors sm:col-span-2 md:col-span-1"
          >
            <div className="text-center">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Create Promotion</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
