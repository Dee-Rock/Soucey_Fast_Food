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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

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
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
    notes?: string;
    restaurant?: string;
    image?: string;
  }>;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Main order interface for the application
interface IOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
    notes?: string;
    restaurant?: string;
    image?: string;
  }>;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
  restaurant?: string;
  image?: string;
}

// Update the mock data to use proper types
const mockOrders = [
  {
    id: '1',
    name: 'Jollof Rice',
    quantity: 2,
    price: 25,
    total: 50,
    notes: 'Extra spicy',
    restaurant: 'Campus Kitchen'
  },
  {
    id: '2',
    name: 'Fried Rice',
    quantity: 1,
    price: 30,
    total: 30,
    restaurant: 'Campus Kitchen'
  },
  {
    id: '3',
    name: 'Banku and Tilapia',
    quantity: 2,
    price: 40,
    total: 80,
    restaurant: 'Local Delights'
  }
] as OrderItem[];

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof IOrder>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();
  
  // Define fetchOrders function that can be used by both useEffect and handleUpdateOrderStatus
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      console.log('Received orders data:', data);
      
      // Check if data exists and has orders property
      if (!data || (!Array.isArray(data) && !Array.isArray(data.orders))) {
        console.error('Invalid data format received:', data);
        throw new Error('Invalid data format received from server');
      }
      
      // Handle both array and object with orders property
      const ordersArray = Array.isArray(data) ? data : data.orders;
      
      // Transform the data to match our expected format
      const formattedOrders: IOrder[] = ordersArray.map((order: any) => ({
        _id: order._id || order.id || '',
        orderNumber: order.orderNumber || `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        customer: typeof order.customer === 'string' 
          ? {
              name: order.customer,
              email: '',
              phone: '',
              address: order.address || ''
            }
          : {
              name: order.customer?.name || 'Unknown',
              email: order.customer?.email || '',
              phone: order.customer?.phone || '',
              address: order.customer?.address || order.address || ''
            },
        items: Array.isArray(order.items) ? order.items.map((item: any) => ({
          name: item.name || 'Unknown Item',
          quantity: Number(item.quantity) || 0,
          price: Number(item.price) || 0,
          total: Number(item.total) || Number(item.price) * Number(item.quantity) || 0,
          notes: item.notes || '',
          restaurant: item.restaurant || '',
          image: item.image || ''
        })) : [{
          name: 'Unknown Item',
          quantity: 1,
          price: Number(order.amount) || 0,
          total: Number(order.amount) || 0
        }],
        status: order.status || 'pending',
        paymentStatus: order.paymentStatus || 'pending',
        paymentMethod: order.paymentMethod || 'cash',
        subtotal: Number(order.subtotal) || Number(order.amount) || 0,
        deliveryFee: Number(order.deliveryFee) || 0,
        total: Number(order.total) || Number(order.amount) || 0,
        address: order.address || '',
        notes: order.notes || '',
        createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
        updatedAt: order.updatedAt ? new Date(order.updatedAt) : new Date()
      }));
      
      console.log('Formatted orders:', formattedOrders);
      setOrders(formattedOrders);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Use fetchOrders in useEffect
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === 'createdAt') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  // Handle order status update
  const handleUpdateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      console.log('Updating order status:', { id, newStatus });
      
      // First verify the order exists
      const order = orders.find(o => o._id === id);
      if (!order) {
        throw new Error('Order not found in local state');
      }

      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ status: newStatus }),
        cache: 'no-store'
      });

      console.log('Update response status:', response.status);
      const responseData = await response.json();
      console.log('Update response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData?.error || 'Failed to update order status');
      }

      // Update the local state with the returned order data
      if (responseData.order) {
        setOrders(orders.map(o => 
          o._id === id ? { ...o, ...responseData.order, updatedAt: new Date(responseData.order.updatedAt) } : o
        ));
      } else {
        // Fallback to basic update if no order data returned
        setOrders(orders.map(o => 
          o._id === id ? { ...o, status: newStatus, updatedAt: new Date() } : o
        ));
      }
      
      // Show success message
      toast({
        title: 'Success',
        description: responseData.message || `Order status updated to ${newStatus}`,
      });

      // Refresh orders after a short delay to ensure we have the latest data
      setTimeout(fetchOrders, 1000);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch('/api/orders', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setOrders(orders.filter(order => order._id !== id));
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting order:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete order',
        variant: 'destructive',
      });
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as keyof IOrder);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500">Manage and track all orders</p>
        </div>
        <Button onClick={() => {}} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 p-2"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="rounded-md border border-gray-300 p-2"
        >
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{order.orderNumber}</div>
                    <div className="text-sm text-gray-500">{order.items.length} items</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-sm text-gray-500">{order.customer.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    GHS {(order.total || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOrder(order._id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
