"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderReceipt } from '@/components/order/order-receipt';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { OrderResponse } from '@/types/order';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-pink-600 mb-4" />
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading order</h2>
          <p className="text-gray-600 mb-6">
            {error || 'We couldn\'t find your order details. Please check your email for a confirmation or contact support.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-pink-600 hover:bg-pink-700">
              <Link href="/my-orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                View My Orders
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/menu">Back to Menu</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your order has been received and is being processed. We've sent a confirmation to your email.
          </p>
          <div className="bg-white inline-block p-4 rounded-lg shadow-sm border border-green-100 mb-6">
            <p className="text-sm font-medium text-gray-500">Order Number</p>
            <p className="text-xl font-semibold text-gray-900">{order.orderNumber}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <OrderReceipt order={order} className="border-0" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-pink-600 hover:bg-pink-700 px-6 py-3 text-base">
            <Link href="/menu">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" className="px-6 py-3 text-base">
            <Link href="/my-orders">
              <span className="flex items-center">
                View Order Status
                <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Need help with your order?</h3>
          <p className="text-sm text-gray-500">
            Contact our support team at{' '}
            <a href="mailto:support@souceyfood.com" className="text-pink-600 hover:underline">
              support@souceyfood.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
