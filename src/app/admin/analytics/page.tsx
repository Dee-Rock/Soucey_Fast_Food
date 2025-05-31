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
import { Card } from '@/components/ui/card'
import { OrderService } from '@/lib/db-service'

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
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: {
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('last_7_days')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics')
        const data = await response.json()
        if (data.success) {
          setAnalyticsData(data.analytics)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{analyticsData?.totalOrders}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">GHS {analyticsData?.totalRevenue.toFixed(2)}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold">GHS {analyticsData?.averageOrderValue.toFixed(2)}</p>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
        <div className="h-[400px]">
          <Bar
            data={{
              labels: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
              datasets: [
                {
                  label: 'Orders by Status',
                  data: [
                    analyticsData?.ordersByStatus.pending,
                    analyticsData?.ordersByStatus.processing,
                    analyticsData?.ordersByStatus.delivered,
                    analyticsData?.ordersByStatus.cancelled
                  ],
                  backgroundColor: [
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                  ],
                  borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
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
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: 'Order Distribution',
                },
              },
            }}
          />
        </div>
      </Card>
    </div>
  )
}
