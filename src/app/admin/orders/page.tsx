"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data';
import { getCollection } from '@/lib/mongodb';
import { IOrder as DbIOrder } from '@/models/Order';
import { ObjectId, WithId, Document } from 'mongodb';

// Interface for customer information
interface ICustomer {
  _id?: string | ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  [key: string]: any; // Allow for additional properties
}

type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'paid' | 'refunded';
type PaymentMethod = 'mobile_money' | 'card' | 'cash' | 'unknown';

// Interface for order items with proper types
interface IOrderItem {
  _id?: string | ObjectId;
  name: string;
  quantity: number;
  price: number | string;
  total?: number;
  notes?: string;
  [key: string]: any; // Allow for additional properties
}

// Type for database order (matches MongoDB document)
interface DbOrderDocument extends Document {
  _id: ObjectId;
  orderNumber?: string;
  customer: any;
  items?: Array<{
    _id?: any;
    name?: string;
    quantity?: number | string;
    price?: number | string;
    total?: number;
    [key: string]: any;
  }>;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  amount?: number | string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [key: string]: any; // Allow for additional properties
}

// Main order interface for the application
interface IOrder {
  _id: string;
  orderNumber: string;
  customer: string | ICustomer;
  items: IOrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  total: number;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();
  
  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const ordersCollection = await getCollection<DbOrderDocument>('orders');
        const sortOption: Record<string, 1 | -1> = { [sortField]: sortDirection === 'asc' ? 1 : -1 };
        const ordersData = await ordersCollection
          .find({})
          .sort(sortOption)
          .toArray();
        
        // Convert MongoDB documents to IOrder format
        const formattedOrders = ordersData.map((orderDoc: WithId<DbOrderDocument>) => {
          // Safely cast the document to a more specific type
          const order = orderDoc as unknown as {
            _id: ObjectId;
            orderNumber?: string;
            customer: any;
            items?: Array<{
              _id?: any;
              name?: string;
              quantity?: number | string;
              price?: number | string;
              total?: number;
            }>;
            status?: string;
            paymentStatus?: string;
            paymentMethod?: string;
            amount?: number | string;
            email?: string;
            phone?: string;
            address?: string;
            notes?: string;
            createdAt?: Date | string;
            updatedAt?: Date | string;
          };
          
          // Ensure we have a proper customer object
          let customer: string | ICustomer;
          if (order.customer && typeof order.customer === 'object') {
            const cust = order.customer as Record<string, unknown>;
            customer = {
              name: (cust.name as string) || 'Unknown Customer',
              email: (cust.email as string) || '',
              phone: (cust.phone as string) || '',
              address: (cust.address as string) || ''
            };
          } else {
            customer = String(order.customer || 'Unknown Customer');
          }
          
          // Map items safely
          const items: IOrderItem[] = [];
          if (Array.isArray(order.items)) {
            order.items.forEach(item => {
              items.push({
                _id: (item._id?.toString()) || new ObjectId().toString(),
                name: item.name || 'Unknown Item',
                quantity: Number(item.quantity) || 1,
                price: Number(item.price) || 0,
                total: (Number(item.quantity) || 1) * (Number(item.price) || 0)
              });
            });
          }
          
          // Safely parse dates
          const createdAt = order.createdAt 
            ? (typeof order.createdAt === 'string' ? new Date(order.createdAt) : order.createdAt)
            : new Date();
            
          const updatedAt = order.updatedAt 
            ? (typeof order.updatedAt === 'string' ? new Date(order.updatedAt) : order.updatedAt)
            : new Date();
          
          // Create the order object with proper typing
          const orderData: IOrder = {
            _id: order._id.toString(),
            orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
            customer,
            items,
            status: (order.status as OrderStatus) || 'pending',
            paymentStatus: (order.paymentStatus as PaymentStatus) || 'pending',
            paymentMethod: (order.paymentMethod as PaymentMethod) || 'unknown',
            total: typeof order.amount === 'string' ? parseFloat(order.amount) : Number(order.amount) || 0,
            email: order.email?.toString() || '',
            phone: order.phone?.toString() || '',
            address: order.address?.toString() || '',
            notes: order.notes?.toString() || '',
            createdAt,
            updatedAt
          };
          
          return orderData;
        });
        
        setOrders(formattedOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
        
        // Fallback to mock data in development
        if (process.env.NODE_ENV === 'development') {
          try {
            const { orders: mockOrders } = await import('@/data/mock-data');
            // Ensure mock data matches IOrder interface
            const typedMockOrders = (mockOrders as any[]).map(order => ({
              ...order,
              _id: order._id || new ObjectId().toString(),
              orderNumber: order.orderNumber || `MOCK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
              customer: order.customer || 'Mock Customer',
              items: order.items?.map((item: any) => ({
                _id: item._id || new ObjectId().toString(),
                name: item.name || 'Mock Item',
                quantity: item.quantity || 1,
                price: item.price || 0,
                total: (item.quantity || 1) * (item.price || 0)
              })) || [],
              status: (order.status as OrderStatus) || 'pending',
              paymentStatus: (order.paymentStatus as PaymentStatus) || 'pending',
              paymentMethod: (order.paymentMethod as PaymentMethod) || 'unknown',
              total: order.total || 0,
              email: order.email || '',
              phone: order.phone || '',
              address: order.address || '',
              createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
              updatedAt: order.updatedAt ? new Date(order.updatedAt) : new Date()
            }));
            
            setOrders(typedMockOrders as IOrder[]);
            setError(null);
          } catch (mockErr) {
            console.error('Error loading mock data:', mockErr);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [sortField, sortDirection]);

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter((order) => {
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const orderNumber = order.orderNumber.toLowerCase();
      const customerName = typeof order.customer === 'string' 
        ? order.customer.toLowerCase() 
        : order.customer.name.toLowerCase();
      
      if (!orderNumber.includes(searchLower) && !customerName.includes(searchLower)) {
        return false;
      }
    }
    
    // Apply status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Apply payment filter
    if (paymentFilter !== 'all' && order.paymentStatus !== paymentFilter) {
      return false;
    }
    
    return true;
  });

  // Handle order status update
  const handleUpdateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      const ordersCollection = await getCollection<DbOrderDocument>('orders');
      const filter = { _id: new ObjectId(id) };
      const update = { $set: { status: newStatus, updatedAt: new Date() } };
      
      await ordersCollection.updateOne(filter, update);
      
      setOrders(orders.map(order => 
        order._id === id 
          ? { ...order, status: newStatus, updatedAt: new Date() } 
          : order
      ));
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    
    try {
      const ordersCollection = await getCollection<DbOrderDocument>('orders');
      const filter = { _id: new ObjectId(id) };
      await ordersCollection.deleteOne(filter);
      
      setOrders(orders.filter(order => order._id !== id));
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order');
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render empty state
  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
            ? 'Try adjusting your search or filter criteria.'
            : 'Get started by creating a new order.'}
        </p>
        <div className="mt-6">
          <Link
            href="/admin/orders/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            New Order
          </Link>
        </div>
      </div>
    );
  }

  // Render orders table
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all orders including their details and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/orders/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            Add order
          </Link>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative rounded-md shadow-sm w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>
      
      {/* Orders table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
                      onClick={() => handleSort('orderNumber')}
                    >
                      <div className="flex items-center">
                        Order
                        {sortField === 'orderNumber' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="ml-1 w-4 h-4" /> : 
                            <ChevronDown className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('customer')}
                    >
                      <div className="flex items-center">
                        Customer
                        {sortField === 'customer' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="ml-1 w-4 h-4" /> : 
                            <ChevronDown className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Items
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('total')}
                    >
                      <div className="flex items-center">
                        Total
                        {sortField === 'total' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="ml-1 w-4 h-4" /> : 
                            <ChevronDown className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Payment
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === 'createdAt' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="ml-1 w-4 h-4" /> : 
                            <ChevronDown className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredOrders.map((order) => (
                    <tr key={order._id.toString()} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {order.orderNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {typeof order.customer === 'string' ? order.customer : order.customer.name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        GH₵{order.total.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <span 
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span 
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : order.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/admin/orders/${order._id}`)}
                            className="text-primary-600 hover:text-primary-900"
                            title="View order"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/orders/${order._id}/edit`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit order"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id.toString())}
                            className="text-red-600 hover:text-red-900"
                            title="Delete order"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to{' '}
          <span className="font-medium">{filteredOrders.length}</span> of{' '}
          <span className="font-medium">{filteredOrders.length}</span> results
        </div>
        <div className="flex space-x-2">
          <button
            disabled={true}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            disabled={true}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Export buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => exportToCSV(filteredOrders, 'orders')}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Download className="-ml-0.5 mr-1.5 h-4 w-4" />
          CSV
        </button>
        <button
          type="button"
          onClick={() => exportToJSON(filteredOrders, 'orders')}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <FileText className="-ml-0.5 mr-1.5 h-4 w-4" />
          JSON
        </button>
      </div>
    </div>
  );
}
