"use client"

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Calendar, 
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react'

// Mock data for analytics
const revenueData = [
  { month: 'Jan', amount: 12500 },
  { month: 'Feb', amount: 18200 },
  { month: 'Mar', amount: 22400 },
  { month: 'Apr', amount: 28700 },
  { month: 'May', amount: 32500 }
]

const ordersData = [
  { month: 'Jan', count: 145 },
  { month: 'Feb', count: 210 },
  { month: 'Mar', count: 258 },
  { month: 'Apr', count: 312 },
  { month: 'May', count: 356 }
]

const usersData = [
  { month: 'Jan', count: 850 },
  { month: 'Feb', count: 1250 },
  { month: 'Mar', count: 1680 },
  { month: 'Apr', count: 2240 },
  { month: 'May', count: 2856 }
]

const popularItems = [
  { name: 'Jollof Rice with Chicken', orders: 456, revenue: 'GHS 16,416.00' },
  { name: 'Banku with Tilapia', orders: 312, revenue: 'GHS 18,720.00' },
  { name: 'Pizza Supreme', orders: 287, revenue: 'GHS 16,068.63' },
  { name: 'Fufu with Light Soup', orders: 245, revenue: 'GHS 15,925.00' },
  { name: 'Kelewele', orders: 198, revenue: 'GHS 3,760.02' }
]

const topRestaurants = [
  { name: 'Ghana Kitchen', orders: 785, revenue: 'GHS 42,500.00' },
  { name: 'Pizza Corner', orders: 654, revenue: 'GHS 36,620.00' },
  { name: 'Accra Delights', orders: 542, revenue: 'GHS 28,750.00' },
  { name: 'Spice Route', orders: 423, revenue: 'GHS 24,120.00' },
  { name: 'Taste of China', orders: 312, revenue: 'GHS 18,720.00' }
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('last_5_months')

  // Calculate current month stats
  const currentMonthRevenue = revenueData[revenueData.length - 1].amount
  const previousMonthRevenue = revenueData[revenueData.length - 2].amount
  const revenueChange = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100

  const currentMonthOrders = ordersData[ordersData.length - 1].count
  const previousMonthOrders = ordersData[ordersData.length - 2].count
  const ordersChange = ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100

  const currentMonthUsers = usersData[usersData.length - 1].count
  const previousMonthUsers = usersData[usersData.length - 2].count
  const usersChange = ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100

  // Calculate max values for chart scaling
  const maxRevenue = Math.max(...revenueData.map(item => item.amount))
  const maxOrders = Math.max(...ordersData.map(item => item.count))
  const maxUsers = Math.max(...usersData.map(item => item.count))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex items-center">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="last_5_months">Last 5 Months</option>
              <option value="last_year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold mt-1">GHS {currentMonthRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center">
            {revenueChange >= 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(revenueChange).toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm ml-1">from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold mt-1">{currentMonthOrders}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center">
            {ordersChange >= 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={ordersChange >= 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(ordersChange).toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm ml-1">from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold mt-1">{currentMonthUsers}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center">
            {usersChange >= 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={usersChange >= 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(usersChange).toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Revenue Overview</h2>
            <div className="flex items-center text-sm text-pink-600">
              <span className="mr-1">View Details</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          
          {/* Simple bar chart for revenue */}
          <div className="h-64 flex items-end space-x-2">
            {revenueData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-pink-500 rounded-t"
                  style={{ 
                    height: `${(item.amount / maxRevenue) * 100}%`,
                    minHeight: '20px'
                  }}
                ></div>
                <div className="text-xs mt-2 text-gray-600">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Orders Overview</h2>
            <div className="flex items-center text-sm text-pink-600">
              <span className="mr-1">View Details</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          
          {/* Simple bar chart for orders */}
          <div className="h-64 flex items-end space-x-2">
            {ordersData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ 
                    height: `${(item.count / maxOrders) * 100}%`,
                    minHeight: '20px'
                  }}
                ></div>
                <div className="text-xs mt-2 text-gray-600">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Items & Top Restaurants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Popular Menu Items</h2>
            <div className="flex items-center text-sm text-pink-600">
              <span className="mr-1">View All</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <div className="p-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Item</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Orders</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {popularItems.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 text-sm font-medium">{item.name}</td>
                    <td className="py-3 text-sm text-right">{item.orders}</td>
                    <td className="py-3 text-sm text-right">{item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Top Restaurants</h2>
            <div className="flex items-center text-sm text-pink-600">
              <span className="mr-1">View All</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <div className="p-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Restaurant</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Orders</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topRestaurants.map((restaurant, index) => (
                  <tr key={index}>
                    <td className="py-3 text-sm font-medium">{restaurant.name}</td>
                    <td className="py-3 text-sm text-right">{restaurant.orders}</td>
                    <td className="py-3 text-sm text-right">{restaurant.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">User Growth</h2>
          <div className="flex items-center text-sm text-pink-600">
            <span className="mr-1">View Details</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        
        {/* Simple bar chart for users */}
        <div className="h-64 flex items-end space-x-2">
          {usersData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-purple-500 rounded-t"
                style={{ 
                  height: `${(item.count / maxUsers) * 100}%`,
                  minHeight: '20px'
                }}
              ></div>
              <div className="text-xs mt-2 text-gray-600">{item.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
