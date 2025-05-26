"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Download,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Loader2,
  ShoppingBag
} from 'lucide-react'
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data'
import { getCollection, deleteDocument, updateDocument, Order } from '@/lib/firestore'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  
  // Load orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const data = await getCollection<Order>('orders')
        setOrders(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to load orders. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrders()
  }, [])

  // Handle order deletion
  const handleDeleteOrder = async (id: string | undefined) => {
    if (!id) return
    
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const success = await deleteDocument('orders', id)
        if (success) {
          setOrders(orders.filter(order => order.id !== id))
        } else {
          alert('Failed to delete order. Please try again.')
        }
      } catch (err) {
        console.error('Error deleting order:', err)
        alert('An error occurred while deleting the order.')
      }
    }
  }

  // Handle order status update
  const handleStatusUpdate = async (id: string | undefined, newStatus: 'pending' | 'processing' | 'delivered' | 'cancelled') => {
    if (!id) return
    
    try {
      const success = await updateDocument('orders', id, { status: newStatus })
      
      if (success) {
        setOrders(orders.map(order => 
          order.id === id ? {...order, status: newStatus} : order
        ))
      } else {
        alert('Failed to update order status. Please try again.')
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      alert('An error occurred while updating the order status.')
    }
  }

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch = 
      (order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a: Order, b: Order) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortField === 'amount') {
      const aAmount = parseFloat(a.amount.replace(/[^0-9.]/g, ''))
      const bAmount = parseFloat(b.amount.replace(/[^0-9.]/g, ''))
      return sortDirection === 'asc' ? aAmount - bAmount : bAmount - aAmount
    } else {
      // Default sort by ID
      return sortDirection === 'asc' 
        ? (a.id || '').localeCompare(b.id || '')
        : (b.id || '').localeCompare(a.id || '')
    }
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => exportToCSV(orders, `soucey-orders-${getFormattedDate()}.csv`)}
            className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => exportToJSON(orders, `soucey-orders-${getFormattedDate()}.json`)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders by ID, customer, email or phone..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('id')}
                  >
                    Order ID
                    {sortField === 'id' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                    {sortField === 'amount' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('date')}
                  >
                    Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((order) => (
                <tr 
                  key={order.id}
                  className={`hover:bg-gray-50 ${selectedOrder === order.id ? 'bg-pink-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <button 
                      onClick={() => order.id && setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-pink-600 hover:text-pink-900"
                    >
                      {order.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{order.customer}</div>
                    <div className="text-xs text-gray-400">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                        order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.paymentStatus === 'refunded' ? 'bg-purple-100 text-purple-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {order.paymentStatus}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">{order.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-pink-600 hover:text-pink-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Details Expandable Section */}
        {selectedOrder && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {orders.filter(order => order.id === selectedOrder).map(order => (
              <div key={`details-${order.id}`}>
                <h3 className="text-lg font-medium mb-4">Order Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                    <p className="text-sm mb-1"><span className="font-medium">Name:</span> {order.customer}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Email:</span> {order.email}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {order.phone}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Delivery Information</h4>
                    <p className="text-sm mb-1"><span className="font-medium">Address:</span> {order.address}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Status:</span> {order.status}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Payment Information</h4>
                    <p className="text-sm mb-1"><span className="font-medium">Method:</span> {order.paymentMethod}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Status:</span> {order.paymentStatus}</p>
                    <p className="text-sm"><span className="font-medium">Total:</span> {order.amount}</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Order Items</h4>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{item.name}</td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right">{item.price}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium" colSpan={2}>Total</td>
                        <td className="px-4 py-2 text-sm font-medium text-right">{order.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium">
                    Print Invoice
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
