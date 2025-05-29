"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { fetchAnalyticsData } from '@/lib/admin-firestore'
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select 
            className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto"
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
              onClick={() => {
                if (analyticsData) {
                  // Convert analytics data to array format for CSV export
                  const exportData = [
                    // Revenue data
                    ...analyticsData.revenueData.labels.map((label, index) => ({
                      type: 'Revenue',
                      label,
                      value: analyticsData.revenueData.data[index]
                    })),
                    // Orders data
                    ...analyticsData.ordersData.labels.map((label, index) => ({
                      type: 'Orders',
                      label,
                      value: analyticsData.ordersData.data[index]
                    })),
                    // Top selling items
                    ...analyticsData.topSellingItems.map(item => ({
                      type: 'Top Item',
                      name: item.name,
                      quantity: item.quantity,
                      revenue: item.revenue
                    })),
                    // Top restaurants
                    ...analyticsData.topRestaurants.map(restaurant => ({
                      type: 'Top Restaurant',
                      name: restaurant.name,
                      orders: restaurant.orders,
                      revenue: restaurant.revenue
                    }))
                  ];
                  exportToCSV(exportData, `analytics-${getFormattedDate()}.csv`);
                }
              }}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex-1 sm:flex-initial"
              disabled={isLoading || !analyticsData}
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>
            <button 
              onClick={() => analyticsData && exportToJSON(analyticsData, `analytics-${getFormattedDate()}.json`)}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex-1 sm:flex-initial"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">Revenue</h2>
                <div className="bg-pink-100 p-1.5 sm:p-2 rounded-full">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                </div>
              </div>
              <div className="h-56 sm:h-64">
                <Line 
                  data={{
                    labels: analyticsData.revenueData.labels,
                    datasets: [
                      {
                        label: 'Revenue (GHS)',
                        data: analyticsData.revenueData.data,
                        borderColor: '#ec4899',
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `GHS ${value}`
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">Orders</h2>
                <div className="bg-pink-100 p-1.5 sm:p-2 rounded-full">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                </div>
              </div>
              <div className="h-56 sm:h-64">
                <Bar
                  data={{
                    labels: analyticsData.ordersData.labels,
                    datasets: [
                      {
                        label: 'Number of Orders',
                        data: analyticsData.ordersData.data,
                        backgroundColor: 'rgba(236, 72, 153, 0.7)',
                        borderRadius: 4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Users & Categories Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">New Users</h2>
                <div className="bg-pink-100 p-1.5 sm:p-2 rounded-full">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                </div>
              </div>
              <div className="h-56 sm:h-64">
                <Line
                  data={{
                    labels: analyticsData.usersData.labels,
                    datasets: [
                      {
                        label: 'New Users',
                        data: analyticsData.usersData.data,
                        borderColor: '#0ea5e9',
                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">Popular Categories</h2>
                <div className="bg-pink-100 p-1.5 sm:p-2 rounded-full">
                  <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                </div>
              </div>
              <div className="h-56 sm:h-64">
                <Doughnut
                  data={{
                    labels: analyticsData.categoryData.labels,
                    datasets: [
                      {
                        label: 'Orders by Category',
                        data: analyticsData.categoryData.data,
                        backgroundColor: [
                          'rgba(236, 72, 153, 0.7)',
                          'rgba(14, 165, 233, 0.7)',
                          'rgba(249, 115, 22, 0.7)',
                          'rgba(132, 204, 22, 0.7)',
                          'rgba(168, 85, 247, 0.7)',
                          'rgba(234, 179, 8, 0.7)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      title: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Top Selling Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Top Selling Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.topSellingItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">GHS {item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Top Restaurants */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Top Restaurants</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                    <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.topRestaurants.map((restaurant, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{restaurant.name}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{restaurant.orders}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">GHS {restaurant.revenue.toFixed(2)}</td>
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
