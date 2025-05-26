"use client"

import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Download, 
  Filter, 
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Loader2,
  XCircle
} from 'lucide-react'
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data'
import { getCollection, deleteDocument, updateDocument, Payment } from '@/lib/firestore'

// Mock data will be replaced with Firestore data
const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    orderId: 'ORD-001',
    customer: 'John Doe',
    amount: 'GHS 125.00',
    method: 'mobile_money',
    provider: 'MTN Mobile Money',
    status: 'successful',
    reference: 'ref-123456789',
    date: '25 May, 2025 - 14:35'
  },
  {
    id: 'PAY-002',
    orderId: 'ORD-002',
    customer: 'Sarah Smith',
    amount: 'GHS 78.50',
    method: 'card',
    provider: 'Visa ****4567',
    status: 'successful',
    reference: 'ref-987654321',
    date: '25 May, 2025 - 12:20'
  },
  {
    id: 'PAY-003',
    orderId: 'ORD-003',
    customer: 'Michael Johnson',
    amount: 'GHS 210.75',
    method: 'cash',
    provider: 'Cash on Delivery',
    status: 'pending',
    reference: 'N/A',
    date: '24 May, 2025 - 19:50'
  },
  {
    id: 'PAY-004',
    orderId: 'ORD-004',
    customer: 'Emma Wilson',
    amount: 'GHS 45.00',
    method: 'mobile_money',
    provider: 'Vodafone Cash',
    status: 'successful',
    reference: 'ref-567891234',
    date: '24 May, 2025 - 13:25'
  },
  {
    id: 'PAY-005',
    orderId: 'ORD-005',
    customer: 'David Brown',
    amount: 'GHS 156.25',
    method: 'mobile_money',
    provider: 'AirtelTigo Money',
    status: 'refunded',
    reference: 'ref-345678912',
    date: '23 May, 2025 - 20:15'
  },
  {
    id: 'PAY-006',
    orderId: 'ORD-006',
    customer: 'Olivia Parker',
    amount: 'GHS 95.50',
    method: 'card',
    provider: 'Mastercard ****7890',
    status: 'successful',
    reference: 'ref-789123456',
    date: '23 May, 2025 - 12:45'
  },
  {
    id: 'PAY-007',
    orderId: 'ORD-007',
    customer: 'James Wilson',
    amount: 'GHS 180.00',
    method: 'mobile_money',
    provider: 'MTN Mobile Money',
    status: 'successful',
    reference: 'ref-234567891',
    date: '22 May, 2025 - 18:20'
  }
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [methodFilter, setMethodFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  // Fetch payments from Firestore
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      try {
        const paymentsData = await getCollection<Payment>('payments')
        setPayments(paymentsData)
        setError('')
      } catch (err) {
        console.error('Error fetching payments:', err)
        setError('Failed to load payments. Please try again.')
        // Use mock data as fallback
        setPayments(mockPayments)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  // Filter payments based on search term and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      (payment.id?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    
    return matchesSearch && matchesMethod && matchesStatus
  })

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortField === 'amount') {
      const aAmount = parseFloat(a.amount.replace('GHS ', ''))
      const bAmount = parseFloat(b.amount.replace('GHS ', ''))
      return sortDirection === 'asc' ? aAmount - bAmount : bAmount - aAmount
    } else {
      // Default sort by ID
      const aId = a.id || ''
      const bId = b.id || ''
      return sortDirection === 'asc' 
        ? aId.localeCompare(bId)
        : bId.localeCompare(aId)
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

  // Handle payment deletion
  const handleDeletePayment = async (id: string) => {
    if (!id) return
    
    if (window.confirm('Are you sure you want to delete this payment?')) {
      setIsDeleting(true)
      try {
        const success = await deleteDocument('payments', id)
        if (success) {
          setPayments(payments.filter(payment => payment.id !== id))
        } else {
          throw new Error('Failed to delete payment')
        }
      } catch (err) {
        console.error('Error deleting payment:', err)
        setError('Failed to delete payment. Please try again.')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  // Handle payment status update
  const handleUpdatePaymentStatus = async (id: string, newStatus: Payment['status']) => {
    if (!id) return
    
    setIsUpdating(true)
    try {
      const success = await updateDocument<Payment>('payments', id, { status: newStatus })
      if (success) {
        setPayments(payments.map(payment => 
          payment.id === id ? { ...payment, status: newStatus } : payment
        ))
      } else {
        throw new Error('Failed to update payment status')
      }
    } catch (err) {
      console.error('Error updating payment status:', err)
      setError('Failed to update payment status. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  // Calculate total revenue
  const totalRevenue = payments
    .filter(payment => payment.status === 'successful')
    .reduce((total, payment) => {
      return total + parseFloat(payment.amount.replace('GHS ', ''))
    }, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => exportToCSV(payments, `soucey-payments-${getFormattedDate()}.csv`)}
            className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            disabled={loading || payments.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => exportToJSON(payments, `soucey-payments-${getFormattedDate()}.json`)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            disabled={loading || payments.length === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <XCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-pink-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading payments...</span>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-semibold mt-1">GHS {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Mobile Money</p>
                  <p className="text-2xl font-semibold mt-1">
                    {payments.filter(p => p.method === 'mobile_money' && p.status === 'successful').length} Transactions
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Card Payments</p>
                  <p className="text-2xl font-semibold mt-1">
                    {payments.filter(p => p.method === 'card' && p.status === 'successful').length} Transactions
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </>  
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search payments by ID, order ID, customer or reference..."
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
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="all">All Methods</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>
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
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
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
                    Payment ID
                    {sortField === 'id' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
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
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {sortedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                    {payment.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{payment.method}</div>
                    <div className="text-xs text-gray-400">{payment.provider}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${payment.status === 'successful' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        payment.status === 'refunded' ? 'bg-purple-100 text-purple-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {payment.status !== 'successful' && (
                        <button
                          onClick={() => handleUpdatePaymentStatus(payment.id || '', 'successful')}
                          className="text-green-600 hover:text-green-900"
                          disabled={isUpdating}
                          title="Mark as Successful"
                        >
                          Mark Successful
                        </button>
                      )}
                      {payment.status !== 'refunded' && (
                        <button
                          onClick={() => handleUpdatePaymentStatus(payment.id || '', 'refunded')}
                          className="text-yellow-600 hover:text-yellow-900"
                          disabled={isUpdating}
                          title="Mark as Refunded"
                        >
                          Refund
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePayment(payment.id || '')}
                        className="text-red-600 hover:text-red-900"
                        disabled={isDeleting}
                        title="Delete Payment"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Payment Details</h3>
                <button 
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment ID</p>
                    <p className="mt-1">{selectedPayment.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order ID</p>
                    <p className="mt-1">{selectedPayment.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <p className="mt-1">{selectedPayment.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="mt-1">{selectedPayment.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Method</p>
                    <p className="mt-1">{selectedPayment.method}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Provider</p>
                    <p className="mt-1">{selectedPayment.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedPayment.status === 'successful' ? 'bg-green-100 text-green-800' :
                        selectedPayment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedPayment.status === 'refunded' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedPayment.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reference</p>
                    <p className="mt-1">{selectedPayment.reference}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="mt-1">{selectedPayment.date}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  {selectedPayment.status !== 'successful' && (
                    <button
                      onClick={() => {
                        handleUpdatePaymentStatus(selectedPayment.id || '', 'successful')
                        setSelectedPayment(null)
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                      disabled={isUpdating}
                    >
                      Mark as Successful
                    </button>
                  )}
                  {selectedPayment.status !== 'refunded' && (
                    <button
                      onClick={() => {
                        handleUpdatePaymentStatus(selectedPayment.id || '', 'refunded')
                        setSelectedPayment(null)
                      }}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                      disabled={isUpdating}
                    >
                      Refund
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleDeletePayment(selectedPayment.id || '')
                      setSelectedPayment(null)
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
