import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Script from 'next/script';
import { PaystackProps } from '@/types/paystack';

interface PaystackPaymentProps {
  amount: number;
  email: string;
  name: string;
  phone: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  channels?: string[];
  mobileMoneyProvider?: string;
}

export default function PaystackPayment({
  amount,
  email,
  name,
  phone,
  onSuccess,
  onClose,
  channels = ['mobile_money', 'card'],
  mobileMoneyProvider,
}: PaystackPaymentProps) {
  const [reference] = useState(`ref-${Date.now()}`);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Function to handle Paystack script loading status
  const handlePaystackScriptLoad = () => {
    console.log('Paystack script loaded successfully');
  };

  const validateEmail = (email: string): boolean => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePhone = (phone: string): boolean => {
    // Basic phone validation for Ghanaian numbers (starts with 0, 233, or +233)
    const phoneRegex = /^(?:\+?233|0)[0-9]{9}$/;
    return phoneRegex.test(phone.trim());
  };

  const handlePayment = () => {
    if (!isClient || typeof window.PaystackPop === 'undefined') {
      console.error('Paystack not loaded or not in client environment');
      alert('Payment service is not available. Please try again later.');
      return;
    }
    
    // Trim and validate all input fields
    const trimmedEmail = email?.trim() || '';
    const trimmedName = name?.trim() || '';
    const trimmedPhone = phone?.trim() || '';
    
    // Log values for debugging
    console.log('Payment validation values:', { 
      email: trimmedEmail, 
      name: trimmedName, 
      phone: trimmedPhone, 
      amount 
    });
    
    // Validate email
    if (!trimmedEmail) {
      console.error('Email is required');
      alert('Please enter your email address to proceed with payment.');
      return;
    }
    
    if (!validateEmail(trimmedEmail)) {
      console.error('Invalid email format');
      return;
    }

    // Validate phone
    if (!validatePhone(trimmedPhone)) {
      console.error('Invalid phone number:', phone);
      alert('Please enter a valid Ghanaian phone number (e.g., 0241234567)');
      return;
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid amount:', amount);
      alert('Invalid payment amount. Please check your cart and try again.');
      return;
    }

    // Ensure Paystack is loaded
    if (typeof window === 'undefined' || !window.PaystackPop) {
      console.error('Paystack not loaded');
      alert('Payment service is not available. Please try again.');
      return;
    }

    // Setup Paystack configuration
    const paystackConfig: any = {
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email: trimmedEmail,
      amount: Math.round(amount * 100), // Convert to kobo
      ref: reference,
      firstname: trimmedName.split(' ')[0] || 'Customer',
      lastname: trimmedName.split(' ').slice(1).join(' ').trim() || 'Name',
      phone: trimmedPhone,
      currency: 'GHS',
      channels: channels || ['card', 'bank', 'ussd', 'mobile_money'],
      callback: (response: any) => {
        console.log('Paystack callback:', response);
        try {
          // Store payment reference
          localStorage.setItem('lastPaymentReference', response.reference);

          // Clear cart
          localStorage.removeItem('cart');

          // Call success handler
          onSuccess(response.reference);

          // Redirect to orders page
          setTimeout(() => {
            window.location.href = '/my-orders';
          }, 1500);
        } catch (error) {
          console.error('Error in payment callback:', error);
          window.location.href = '/my-orders';
        }
      },
      onClose: () => {
        console.log('Payment window closed');
        onClose();
      }
    };

    // Add mobile money provider if specified
    if (mobileMoneyProvider) {
      paystackConfig.metadata = {
        custom_fields: [
          {
            display_name: 'Mobile Money',
            variable_name: 'mobile_money',
            value: mobileMoneyProvider
          }
        ]
      };
    }

    // Add mobile money provider if mobile_money is in channels
    if (channels.includes('mobile_money') && mobileMoneyProvider) {
      // For Paystack, we need to specify the mobile money provider in metadata
      paystackConfig.metadata = {
        ...paystackConfig.metadata,
        custom_fields: [
          {
            display_name: 'Mobile Money Provider',
            variable_name: 'mobile_money_provider',
            value: mobileMoneyProvider
          }
        ]
      };

      // Set the mobile money provider in the transaction data
      // This helps Paystack route to the correct mobile money provider
      if (mobileMoneyProvider === 'mtn') {
        paystackConfig.mobile_money_provider = 'mtn';
      } else if (mobileMoneyProvider === 'vodafone') {
        paystackConfig.mobile_money_provider = 'vod';
      } else if (mobileMoneyProvider === 'airtel') {
        paystackConfig.mobile_money_provider = 'tgo';
      }
    }

    const paystack = window.PaystackPop.setup(paystackConfig);
    paystack.openIframe();
  };

  if (!isClient) {
    return null; // Don't render on server
  }

  return (
    <div className="w-full">
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="lazyOnload"
        onLoad={handlePaystackScriptLoad}
      />
      <Button
        onClick={(e) => {
          e.preventDefault();
          handlePayment();
        }}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
        disabled={!isClient}
      >
        {isClient ? 'Pay Now' : 'Loading...'}
      </Button>
    </div>
  );
}
