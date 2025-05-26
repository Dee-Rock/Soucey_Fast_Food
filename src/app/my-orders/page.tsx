"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCollection, Order } from '@/lib/firestore';
import { formatPrice } from '@/lib/utils';
import { Loader2, Package, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // In a real app, you would filter orders by the current user's ID
        // For now, we'll just fetch all orders as a demo
        const ordersData = await getCollection<Order>('orders');
        // Sort orders by date (newest first)
        const sortedOrders = ordersData.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setOrders(sortedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get payment status badge color
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
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

      {loading ? (
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
                    <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                    <p className="text-gray-500 text-sm">{order.date}</p>
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
                        {order.status === 'delivered' && 'Your order has been delivered successfully.'}
                        {order.status === 'cancelled' && 'Your order has been cancelled.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-2">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 text-sm block">x{item.quantity}</span>
                        </div>
                        <span>{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-pink-600">{order.amount}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Delivery Address</span>
                      <p className="text-sm">{order.address}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Contact</span>
                      <p className="text-sm">{order.phone}</p>
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
