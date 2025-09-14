"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, MapPin, DollarSign, CheckCircle, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import PaystackPayment from '@/components/paystack-payment';
import { useToast } from '@/components/ui/use-toast';
import PaymentOptions from '@/components/payment-options';
import { useCart } from '@/context/cart-context';

type PaymentMethod = 'mobile_money' | 'card' | 'cash';

interface CartItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

// Define the order item type
interface RestaurantInfo {
  id: string | number;
  name: string;
  deliveryFee: number;
}

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
  id: string | number;
  restaurant: RestaurantInfo;
  image?: string;
};

// Define the customer type
type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  campus: string;
  landmark?: string;
};

interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  campus: string;
  landmark?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  notes: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, subtotal, total, deliveryFee, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mobile_money');
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(5);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [campus, setCampus] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const redirectAttempted = useRef<boolean>(false);
  const { toast } = useToast();
  
  // Load user information from localStorage if available
  useEffect(() => {
    const loadUserInfo = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedUserInfo = localStorage.getItem('userInfo');
          if (savedUserInfo) {
            const userInfo = JSON.parse(savedUserInfo);
            setCustomerName(userInfo.name || '');
            setCustomerEmail(userInfo.email || '');
            setCustomerPhone(userInfo.phone || '');
            setAddress(userInfo.address || '');
            setCampus(userInfo.campus || '');
          }
        }
      } catch (error) {
        console.error('Error loading user info from localStorage:', error);
      }
    };
    
    loadUserInfo();
  }, []);

  // Handle redirect after order placement
  useEffect(() => {
    if (orderPlaced && orderId) {
      let countdownInterval: NodeJS.Timeout;
      
      // Start the countdown
      const startCountdown = () => {
        setRedirectCountdown(5);
        
        countdownInterval = setInterval(() => {
          setRedirectCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              router.push('/my-orders');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      };
      
      startCountdown();
      
      // Cleanup interval on unmount or when dependencies change
      return () => {
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
      };
    }
  }, [orderPlaced, orderId, router]);

  // Validate form fields
  const validateForm = (): boolean => {
    if (cartItems.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Please add items to your cart before checkout.',
        variant: 'destructive',
        duration: 3000,
      });
      return false;
    }
    
    const requiredFields = [
      { value: customerName, field: 'Full Name' },
      { value: customerPhone, field: 'Phone Number' },
      { value: customerEmail, field: 'Email Address' },
      { value: address, field: 'Delivery Address' },
      { value: campus, field: 'Campus/Area' },
    ];
    
    for (const { value, field } of requiredFields) {
      if (!value.trim()) {
        toast({
          title: 'Missing Information',
          description: `Please enter your ${field.toLowerCase()}.`,
          variant: 'destructive',
          duration: 3000,
        });
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
        duration: 3000,
      });
      return false;
    }
    
    return true;
  };

  const saveOrder = async (orderData: OrderData): Promise<{ success: boolean; orderId?: string }> => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save order');
      }

      return { success: true, orderId: result.orderId };
    } catch (error) {
      console.error('Error saving order:', error);
      return { success: false };
    }
  };

  const handlePaymentSuccess = async (reference: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);

      // Create order data
      const orderData: OrderData = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        address: address.trim(),
        campus: campus.trim(),
        landmark: landmark.trim(),
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
          notes: item.notes || '',
          restaurant: item.restaurant,
          image: item.image
        })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        notes: notes.trim(),
      };

      const { success, orderId: newOrderId } = await saveOrder(orderData);

      if (success && newOrderId) {
        // Clear cart and redirect to success page
        clearCart();
        router.push(`/checkout/success?orderId=${newOrderId}`);
        return true;
      } else {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
      toast({
        title: 'Error',
        description: 'There was an error processing your order. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  // Order placed confirmation
  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been received and is being processed. We'll send you a confirmation email shortly.
          </p>
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-xl font-semibold">{orderId}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/menu">Continue Shopping</Link>
            </Button>
            <Button asChild>
              <Link href="/my-orders">View Order Status</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-gray-600 mb-8">Complete your order</p>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-pink-600 mr-2" />
              <h2 className="text-xl font-semibold">Delivery Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input 
                  id="fullName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Input 
                  id="phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Your phone number"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <Input 
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <Input 
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your full delivery address"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-1">
                  Campus/Area *
                </label>
                <Input 
                  id="campus"
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  placeholder="e.g., Main Campus"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark (Optional)
                </label>
                <Input 
                  id="landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g., Near the library"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Instructions (Optional)
                </label>
                <Input 
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for delivery"
                />
              </div>
            </div>
          </div>
          
          {/* Payment Method - Removed as per requirements */}
          <input type="hidden" name="paymentMethod" value="cash" />
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    {item.notes && (
                      <p className="text-xs text-gray-500 mt-1">Note: {item.notes}</p>
                    )}
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Total
                  </span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-2">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
                {paymentMethod === 'cash' ? (
                  <Button 
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    size="lg"
                    onClick={async () => {
                      const success = await handlePaymentSuccess('cash_payment_' + Date.now());
                      if (success) {
                        setShouldRedirect(true);
                      }
                    }}
                    disabled={isSubmitting || cartItems.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      `Place Order (Pay on Delivery)`
                    )}
                  </Button>
                ) : (
                  <div className="mt-4">
                    <PaystackPayment
                      amount={total}
                      email={customerEmail}
                      name={customerName}
                      phone={customerPhone}
                      onSuccess={handlePaymentSuccess}
                      onClose={() => {}}
                      channels={[paymentMethod === 'mobile_money' ? 'mobile_money' : 'card']}
                      mobileMoneyProvider={paymentMethod === 'mobile_money' ? 'mtn' : undefined}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Secure payment powered by Paystack
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
