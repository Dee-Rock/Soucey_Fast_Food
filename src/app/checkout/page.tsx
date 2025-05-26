"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, MapPin, DollarSign, CheckCircle, Loader2, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import PaymentOptions from '@/components/payment-options';
import { addDocument, Order } from '@/lib/firestore';
import { useCart } from '@/context/cart-context';

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, subtotal, total, deliveryFee, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [campus, setCampus] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [orderId, setOrderId] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const redirectAttempted = useRef(false);
  const { toast } = useToast();
  
  // Load user information from localStorage if available
  useEffect(() => {
    const loadUserInfo = () => {
      try {
        const savedUserInfo = localStorage.getItem('userInfo');
        if (savedUserInfo) {
          const userInfo = JSON.parse(savedUserInfo);
          setCustomerName(userInfo.name || '');
          setCustomerEmail(userInfo.email || '');
          setCustomerPhone(userInfo.phone || '');
          setAddress(userInfo.address || '');
          setCampus(userInfo.campus || '');
        }
      } catch (error) {
        console.error('Error loading user info from localStorage:', error);
      }
    };
    
    loadUserInfo();
  }, []);
  
  // Debug payment information
  useEffect(() => {
    if (customerName || customerEmail || customerPhone) {
      console.log('Payment information updated:', { 
        customerName, 
        customerEmail, 
        customerPhone,
        total
      });
    }
  }, [customerName, customerEmail, customerPhone, total]);
  
  // Effect to handle redirection after successful payment
  useEffect(() => {
    if (shouldRedirect && !redirectAttempted.current) {
      redirectAttempted.current = true;
      setIsRedirecting(true);
      console.log('Starting redirect countdown...');
      
      // Start a countdown for visual feedback
      const countdownInterval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // Perform the actual redirect after countdown
            console.log('Redirecting to my-orders page now...');
            window.location.href = '/my-orders';
            
            // Fallback to router.push
            setTimeout(() => {
              console.log('Fallback redirect attempt...');
              router.push('/my-orders');
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Clear cart after successful order
      clearCart();
      
      // Save user info for future checkouts
      try {
        localStorage.setItem('userInfo', JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address,
          campus
        }));
      } catch (error) {
        console.error('Error saving user info to localStorage:', error);
      }
      
      return () => clearInterval(countdownInterval);
    }
  }, [shouldRedirect, router]);

  // Cart calculations are now handled by the cart context

  const validateForm = () => {
    // Check if cart is empty
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    // Check required fields
    if (!customerName) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    if (!customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone number.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    if (!customerEmail) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    if (!address || !campus) {
      toast({
        title: "Missing Information",
        description: "Please enter your delivery address and campus/area.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    return true;
  };
  
  const handlePlaceOrder = async (reference = '') => {
    console.log('Handling place order with reference:', reference);
    console.log('Customer information:', { customerName, customerEmail, customerPhone, address, campus });
    
    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create a new order in Firestore
      const fullAddress = `${address}, ${campus}${landmark ? `, near ${landmark}` : ''}`;
      
      const orderData: Omit<Order, 'id' | 'createdAt'> = {
        customer: customerName,
        email: customerEmail,
        phone: customerPhone,
        amount: `GHS ${total.toFixed(2)}`,
        status: 'pending',
        paymentStatus: reference ? 'paid' : 'pending',
        paymentMethod: paymentMethod as 'mobile_money' | 'card' | 'cash',
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: `GHS ${item.price.toFixed(2)}`
        })),
        address: fullAddress,
        notes: notes || 'No special instructions'
      };
      
      // Add the order to Firestore
      const newOrderId = await addDocument<Omit<Order, 'id' | 'createdAt'>>('orders', orderData);
      
      if (newOrderId) {
        setOrderId(newOrderId);
        // Set order placed to true to show confirmation screen if redirect fails
        setOrderPlaced(true);
        
        // Store the order ID in localStorage for retrieval on the orders page
        localStorage.setItem('lastOrderId', newOrderId);
        
        // Show a toast notification
        toast({
          title: "Order placed successfully!",
          description: `Your food is being prepared and will be delivered soon. ${reference ? `Payment Reference: ${reference}` : ''}`,
          duration: 5000,
        });
        
        // Trigger redirection via useEffect with visual feedback
        console.log('Setting shouldRedirect to true');
        setShouldRedirect(true);
        setIsRedirecting(true);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error placing order",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handlePaymentClose = () => {
    toast({
      title: "Payment cancelled",
      description: "You can try again or choose a different payment method.",
      variant: "destructive",
      duration: 3000,
    });
  };

  // Show redirecting state or order confirmation
  if (isRedirecting) {
    return (
      <div className="container mx-auto px-4 py-12">
        {/* Direct navigation button at the top */}
        <div className="max-w-2xl mx-auto mb-4">
          <Button 
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 text-lg font-bold"
            onClick={() => window.location.href = '/my-orders'}
          >
            ➡️ CLICK HERE TO GO TO ORDER TRACKING PAGE NOW ⬅️
          </Button>
        </div>
        
        <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-md p-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. Redirecting you to the order tracking page...
          </p>
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="font-medium">Order Number</p>
            <p className="text-2xl font-bold text-pink-600">{orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`}</p>
          </div>
          <div className="mb-8">
            <p className="text-xl font-semibold">Redirecting in {redirectCountdown} seconds...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-pink-600 h-2.5 rounded-full transition-all duration-1000" 
                style={{ width: `${(redirectCountdown / 5) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-pink-600 hover:bg-pink-700 text-white py-6 text-xl font-bold animate-pulse"
              onClick={() => window.location.href = '/my-orders'}
            >
              GO TO ORDER TRACKING PAGE
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Fallback confirmation screen
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
            <p className="text-2xl font-bold text-pink-600">{orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`}</p>
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
              <Link href="/my-orders">
                Track My Order
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
                <Input 
                  id="fullName" 
                  placeholder="Your full name" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input 
                  id="phone" 
                  placeholder="Your phone number" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="Your email address" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Input 
                  id="address" 
                  placeholder="Your delivery address" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-1">
                  Campus/Area
                </label>
                <Input 
                  id="campus" 
                  placeholder="Your campus or area" 
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark (Optional)
                </label>
                <Input 
                  id="landmark" 
                  placeholder="Nearby landmark" 
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Notes (Optional)
                </label>
                <Input 
                  id="notes" 
                  placeholder="Any special instructions for delivery" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
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
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Choose your preferred mobile money provider below. You will receive a prompt on your phone to confirm the payment.
                  </p>
                  
                  {/* Add debugging in useEffect instead of directly in JSX */}
                  <PaymentOptions 
                    amount={total}
                    email={customerEmail || ''}
                    name={customerName || ''}
                    phone={customerPhone || ''}
                    onSuccess={(reference) => handlePlaceOrder(reference)}
                    onClose={handlePaymentClose}
                  />
                </div>
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
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-gray-100">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 text-sm block">x{item.quantity}</span>
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-500">
                  Your cart is empty. Please add items to proceed with checkout.
                </div>
              )}
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
                onClick={() => handlePlaceOrder()}
              >
                Place Order <CheckCircle className="ml-2 w-4 h-4" />
              </Button>
            ) : paymentMethod === 'mobile' ? (
              <div className="text-center text-sm text-gray-600 mb-4">
                Please select your payment options in the Mobile Money section above.
              </div>
            ) : paymentMethod === 'card' ? (
              <PaymentOptions 
                amount={total}
                email={customerEmail}
                name={customerName}
                phone={customerPhone}
                onSuccess={(reference) => handlePlaceOrder(reference)}
                onClose={handlePaymentClose}
              />
            ) : null}
            
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
