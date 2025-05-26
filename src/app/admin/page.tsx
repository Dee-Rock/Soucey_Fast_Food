"use client"

import { useState } from 'react'
import { 
  ShoppingBag, 
  CreditCard, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  UtensilsCrossed,
  Download,
  FileText,
  Database
} from 'lucide-react'
import Link from 'next/link'
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data'

// Mock data (would come from your database in a real app)
const stats = [
  { name: 'Total Orders', value: '156', change: '+12%', trend: 'up', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'Revenue', value: 'GHS 8,942', change: '+18%', trend: 'up', icon: CreditCard, href: '/admin/payments' },
  { name: 'Active Users', value: '2,856', change: '+7%', trend: 'up', icon: Users, href: '/admin/users' },
  { name: 'Conversion Rate', value: '24.3%', change: '-2%', trend: 'down', icon: TrendingUp, href: '/admin/analytics' },
]

// Recent orders mock data
const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    amount: 'GHS 125.00',
    status: 'delivered',
    date: '25 May, 2025',
    items: ['Jollof Rice with Chicken', 'Kelewele']
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Smith',
    amount: 'GHS 78.50',
    status: 'processing',
    date: '25 May, 2025',
    items: ['Banku with Tilapia', 'Sobolo Drink']
  },
  {
    id: 'ORD-003',
    customer: 'Michael Johnson',
    amount: 'GHS 210.75',
    status: 'pending',
    date: '24 May, 2025',
    items: ['Pizza Supreme', 'Coca Cola', 'Chicken Wings']
  },
  {
    id: 'ORD-004',
    customer: 'Emma Wilson',
    amount: 'GHS 45.00',
    status: 'delivered',
    date: '24 May, 2025',
    items: ['Waakye with Fish', 'Shito']
  },
  {
    id: 'ORD-005',
    customer: 'David Brown',
    amount: 'GHS 156.25',
    status: 'cancelled',
    date: '23 May, 2025',
    items: ['Fried Rice', 'Chicken', 'Coleslaw', 'Sprite']
  },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Link
            href="/admin/seed"
            className="inline-flex items-center px-3 py-2 border border-pink-600 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <Database className="h-4 w-4 mr-1" />
            Seed Database
          </Link>
          <select className="px-3 py-2 border rounded-md text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
          <div className="flex space-x-2">
            <button 
              onClick={() => exportToCSV([...stats, ...recentOrders], `soucey-dashboard-${getFormattedDate()}.csv`)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>
            <button 
              onClick={() => exportToJSON({stats, recentOrders}, `soucey-dashboard-${getFormattedDate()}.json`)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <FileText className="h-4 w-4 mr-1" />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            href={stat.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className="bg-pink-50 p-3 rounded-full">
                <stat.icon className="h-6 w-6 text-pink-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {stat.change}
              </span>
              <span className="text-gray-500 text-sm ml-1">from last period</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium">Recent Orders</h2>
          <Link 
            href="/admin/orders" 
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {order.items.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="text-pink-600 hover:text-pink-900 mr-3">
                      View
                    </Link>
                    <button className="text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/admin/restaurants/new" 
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
          >
            <div className="text-center">
              <Store className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Add New Restaurant</span>
            </div>
          </Link>
          <Link 
            href="/admin/menu-items/new" 
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
          >
            <div className="text-center">
              <UtensilsCrossed className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Add New Menu Item</span>
            </div>
          </Link>
          <Link 
            href="/admin/settings/promotions" 
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
          >
            <div className="text-center">
              <CreditCard className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Create Promotion</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
