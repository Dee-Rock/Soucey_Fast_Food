"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import FlutterwavePayment from '@/components/flutterwave-payment';

// Sample cart items (in a real app, this would come from a state manager)
const cartItems = [
  {
    id: 1,
    name: 'Jollof Rice with Chicken',
    price: 35.99,
    quantity: 2,
    restaurant: 'Ghana Kitchen',
  },
  {
    id: 5,
    name: 'Pizza Supreme',
    price: 55.99,
    quantity: 1,
    restaurant: 'Pizza Corner',
  },
  {
    id: 12,
    name: 'Kelewele',
    price: 18.99,
    quantity: 3,
    restaurant: 'Accra Delights',
  },
];

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { toast } = useToast();

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Delivery fee
  const deliveryFee = 10.00;
  
  // Calculate total
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    // In a real app, this would submit the order to the backend
    setTimeout(() => {
      setOrderPlaced(true);
      toast({
        title: "Order placed successfully!",
        description: "Your food is being prepared and will be delivered soon.",
        duration: 5000,
      });
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-md p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your food is being prepared and will be delivered soon.
          </p>
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="font-medium">Order Number</p>
            <p className="text-2xl font-bold text-pink-600">ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
          <p className="text-gray-600 mb-8">
            A confirmation has been sent to your email address.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/menu">
                Order More Food
              </Link>
            </Button>
            <Button asChild className="bg-pink-600 hover:bg-pink-700">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
      <p className="text-gray-600 mb-8">Complete your order</p>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-pink-600 mr-2" />
              <h2 className="text-xl font-semibold">Delivery Address</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input id="fullName" placeholder="Your full name" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input id="phone" placeholder="Your phone number" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Input id="address" placeholder="Your delivery address" />
              </div>
              <div>
                <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-1">
                  Campus/Area
                </label>
                <Input id="campus" placeholder="Your campus or area" />
              </div>
              <div>
                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark (Optional)
                </label>
                <Input id="landmark" placeholder="Nearby landmark" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Notes (Optional)
                </label>
                <Input id="notes" placeholder="Any special instructions for delivery" />
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="w-5 h-5 text-pink-600 mr-2" />
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </div>
            
            <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
              <TabsList className="mb-6">
                <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
                <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
                <TabsTrigger value="cash">Cash on Delivery</TabsTrigger>
              </TabsList>
              
              <TabsContent value="card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <Input id="cardName" placeholder="Your name as on card" />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <Input id="cvv" placeholder="123" type="password" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mobile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Money Provider
                    </label>
                    <select id="provider" className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md">
                      <option value="">Select Provider</option>
                      <option value="mtn">MTN Mobile Money</option>
                      <option value="vodafone">Vodafone Cash</option>
                      <option value="airtel">AirtelTigo Money</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Money Number
                    </label>
                    <Input id="mobileNumber" placeholder="Your mobile money number" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  You will receive a prompt on your phone to confirm the payment.
                </p>
              </TabsContent>
              
              <TabsContent value="cash">
                <p className="text-gray-600">
                  Pay with cash upon delivery. Please have the exact amount ready.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b border-gray-100">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 text-sm block">x{item.quantity}</span>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="border-t pt-3 mt-3 border-gray-200">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-pink-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            {paymentMethod === 'cash' ? (
              <Button 
                className="w-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center"
                onClick={handlePlaceOrder}
              >
                Place Order <CheckCircle className="ml-2 w-4 h-4" />
              </Button>
            ) : paymentMethod === 'mobile' ? (
              <Button 
                className="w-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center"
                onClick={handlePlaceOrder}
              >
                Pay with Mobile Money <DollarSign className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <FlutterwavePayment
                amount={total}
                customerName="John Doe" // This would come from the user's profile
                customerEmail="customer@example.com" // This would come from the user's profile
                customerPhone="+233201234567" // This would come from the form
                orderId={`ORD-${Math.floor(100000 + Math.random() * 900000)}`}
                onSuccess={handlePlaceOrder}
              />
            )}
            
            <p className="mt-4 text-center text-sm text-gray-500">
              By placing your order, you agree to our{' '}
              <Link href="/terms" className="text-pink-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-pink-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
