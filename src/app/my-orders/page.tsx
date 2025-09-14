"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Loader2, Package, Clock, CheckCircle, XCircle, ArrowLeft, FileText, Download } from 'lucide-react';
import { ObjectId, WithId, Document } from 'mongodb';

interface BaseOrderItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
  _id?: any; // Will be ObjectId from MongoDB
}

interface OrderItem extends Omit<BaseOrderItem, '_id'> {
  _id?: string; // String ID for client-side
}

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'delivered';
type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

interface BaseOrder {
  _id: ObjectId | string;
  id?: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: BaseOrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// For API response
interface OrderResponse {
  _id: string;
  id: string;
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
    _id?: string;
  }>;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// For API response
interface OrderResponse {
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
    _id?: string;
  }>;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  createdAt: string;
  updatedAt: string;
  date?: string; // Added to match the API response
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const response = await fetch('/api/orders');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(
          errorData?.error || `Failed to fetch orders: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Received orders data:', data);
      
      if (!data || !data.orders) {
        console.error('Invalid data format received:', data);
        throw new Error('Invalid data format received from server');
      }
      
      // Transform the data to match our expected format
      const formattedOrders = data.orders.map((order: any) => {
        console.log('Processing order:', order);
        return {
          ...order,
          id: order._id, // Ensure we have an id field
          // Ensure all dates are strings
          createdAt: order.createdAt || new Date().toISOString(),
          updatedAt: order.updatedAt || new Date().toISOString(),
          // Ensure items have all required fields
          items: (order.items || []).map((item: any) => ({
            name: item.name || 'Unnamed Item',
            quantity: item.quantity || 1,
            price: item.price || 0,
            total: item.total || item.price * (item.quantity || 1) || 0,
            notes: item.notes,
            _id: item._id
          }))
        };
      });
      
      console.log('Formatted orders:', formattedOrders);
      setOrders(formattedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Set up polling every 10 seconds to check for updates
    const intervalId = setInterval(fetchOrders, 10000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to get status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get payment status badge color
  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get payment status icon
  const getPaymentStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'refunded':
        return <XCircle className="h-5 w-5 text-purple-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case 'delivered':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">My Orders</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-pink-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading your orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Browse our menu and place your first order!
          </p>
          <Button asChild className="bg-pink-600 hover:bg-pink-700">
            <Link href="/menu">
              Browse Menu
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order.orderNumber}</h2>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center mb-4">
                    {getStatusIcon(order.status)}
                    <div className="ml-3">
                      <span className="font-medium">Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                      <p className="text-sm text-gray-500">
                        {order.status === 'pending' && 'Your order has been received and is waiting to be processed.'}
                        {order.status === 'processing' && 'Your order is being prepared and will be out for delivery soon.'}
                        {(order.status === 'delivered' || order.status === 'completed') && 'Your order has been delivered successfully.'}
                        {order.status === 'cancelled' && 'Your order has been cancelled.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item: OrderItem, index: number) => (
                      <div key={index} className="flex justify-between py-2">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 text-sm block">x{item.quantity}</span>
                        </div>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-pink-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col space-y-4">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => window.open(`/checkout/success?orderId=${order._id}`, '_blank')}
                      >
                        <FileText className="h-4 w-4" />
                        View Receipt
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={async () => {
                          try {
                            const { jsPDF } = await import('jspdf');
                            const response = await fetch(`/api/orders/${order._id}`);
                            const orderData = await response.json();
                            
                            const doc = new jsPDF();
                            const receiptElement = document.createElement('div');
                            receiptElement.className = 'print-content';
                            document.body.appendChild(receiptElement);
                            
                            // Render the receipt component
                            const { renderToString } = await import('react-dom/server');
                            const { OrderReceipt } = await import('@/components/order/order-receipt');
                            
                            receiptElement.innerHTML = renderToString(<OrderReceipt order={orderData} />);
                            
                            // Generate PDF
                            await doc.html(receiptElement, {
                              callback: (pdf) => {
                                pdf.save(`receipt-${order.orderNumber}.pdf`);
                                document.body.removeChild(receiptElement);
                              },
                              margin: 10,
                              html2canvas: {
                                scale: 0.7,
                                useCORS: true,
                              },
                            });
                          } catch (error) {
                            console.error('Error generating PDF:', error);
                          }
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Delivery Address</span>
                      <p className="text-sm">{order.address}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Contact</span>
                      <p className="text-sm">{order.customer.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Payment Method</span>
                      <p className="text-sm">
                        {order.paymentMethod === 'mobile_money' && 'Mobile Money'}
                        {order.paymentMethod === 'card' && 'Card Payment'}
                        {order.paymentMethod === 'cash' && 'Cash on Delivery'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
