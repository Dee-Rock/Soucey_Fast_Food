"use client"

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Download, 
  FileText, 
  TrendingUp, 
  ShoppingBag, 
  CreditCard, 
  Users,
  Utensils,
  Loader
} from 'lucide-react'
import { fetchAnalyticsData } from '@/lib/admin-mongodb'
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data'

interface AnalyticsData {
  revenueData: {
    labels: string[];
    data: number[];
  };
  ordersData: {
    labels: string[];
    data: number[];
  };
  usersData: {
    labels: string[];
    data: number[];
  };
  categoryData: {
    labels: string[];
    data: number[];
  };
  topSellingItems: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
  topRestaurants: {
    name: string;
    orders: number;
    revenue: number;
  }[];
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('last_7_days')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchAnalyticsData(timeRange)
        setAnalyticsData(data)
      } catch (err) {
        console.error('Error loading analytics data:', err)
        setError('Failed to load analytics data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAnalyticsData()
  }, [timeRange])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex space-x-2">
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
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                if (analyticsData) {
                  // Convert analytics data to array format for CSV export
                  const exportData = [
                    // Revenue data
                    ...analyticsData.revenueData.labels.map((label, i) => ({
                      type: 'Revenue',
                      label,
                      value: analyticsData.revenueData.data[i]
                    })),
                    // Orders data
                    ...analyticsData.ordersData.labels.map((label, i) => ({
                      type: 'Orders',
                      label,
                      value: analyticsData.ordersData.data[i]
                    })),
                    // Top selling items
                    ...analyticsData.topSellingItems.map(item => ({
                      type: 'TopItem',
                      name: item.name,
                      quantity: item.quantity,
                      revenue: item.revenue
                    })),
                    // Top restaurants
                    ...analyticsData.topRestaurants.map(restaurant => ({
                      type: 'TopRestaurant',
                      name: restaurant.name,
                      orders: restaurant.orders,
                      revenue: restaurant.revenue
                    }))
                  ];
                  exportToCSV(exportData, `analytics-${getFormattedDate()}.csv`);
                }
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              disabled={isLoading || !analyticsData}
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>
            <button 
              onClick={() => analyticsData && exportToJSON(analyticsData, `analytics-${getFormattedDate()}.json`)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              disabled={isLoading || !analyticsData}
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
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          {error}
        </div>
      )}
      
      {/* Analytics Content */}
      {!isLoading && !error && analyticsData && (
        <div className="space-y-8">
          {/* Revenue & Orders Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Revenue</h2>
                <div className="bg-pink-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-pink-600" />
                </div>
              </div>
              <div className="h-64 flex items-center justify-center">
                {/* Chart would be rendered here */}
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 text-pink-300" />
                  <p>Revenue chart visualization would appear here</p>
                  <p className="text-sm mt-2">Data: {analyticsData.revenueData.labels.join(', ')}</p>
                  <p className="text-sm">Values: {analyticsData.revenueData.data.join(', ')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Orders</h2>
                <div className="bg-pink-100 p-2 rounded-full">
                  <ShoppingBag className="h-5 w-5 text-pink-600" />
                </div>
              </div>
              <div className="h-64 flex items-center justify-center">
                {/* Chart would be rendered here */}
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 text-pink-300" />
                  <p>Orders chart visualization would appear here</p>
                  <p className="text-sm mt-2">Data: {analyticsData.ordersData.labels.join(', ')}</p>
                  <p className="text-sm">Values: {analyticsData.ordersData.data.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Users & Categories Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">New Users</h2>
                <div className="bg-pink-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-pink-600" />
                </div>
              </div>
              <div className="h-64 flex items-center justify-center">
                {/* Chart would be rendered here */}
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 text-pink-300" />
                  <p>Users chart visualization would appear here</p>
                  <p className="text-sm mt-2">Data: {analyticsData.usersData.labels.join(', ')}</p>
                  <p className="text-sm">Values: {analyticsData.usersData.data.join(', ')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Popular Categories</h2>
                <div className="bg-pink-100 p-2 rounded-full">
                  <Utensils className="h-5 w-5 text-pink-600" />
                </div>
              </div>
              <div className="h-64 flex items-center justify-center">
                {/* Chart would be rendered here */}
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 text-pink-300" />
                  <p>Categories chart visualization would appear here</p>
                  <p className="text-sm mt-2">Data: {analyticsData.categoryData.labels.join(', ')}</p>
                  <p className="text-sm">Values: {analyticsData.categoryData.data.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Top Selling Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Top Selling Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.topSellingItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GHS {item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Top Restaurants */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Top Restaurants</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.topRestaurants.map((restaurant, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{restaurant.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{restaurant.orders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GHS {restaurant.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
