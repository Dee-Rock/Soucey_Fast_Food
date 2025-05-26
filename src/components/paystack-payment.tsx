import { useState, useEffect } from 'react';
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

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Function to handle Paystack script loading status
  const handlePaystackScriptLoad = () => {
    console.log('Paystack script loaded successfully');
  };

  const handlePayment = () => {
    if (!isClient || typeof window.PaystackPop === 'undefined') {
      console.error('Paystack not loaded or not in client environment');
      return;
    }
    
    // Validate required fields and log values for debugging
    console.log('Payment validation values:', { email, name, phone, amount });
    
    if (!email || email.trim() === '') {
      console.error('Missing email');
      alert('Please provide your email address to proceed with payment.');
      return;
    }
    
    if (!name || name.trim() === '') {
      console.error('Missing name');
      alert('Please provide your full name to proceed with payment.');
      return;
    }
    
    if (!phone || phone.trim() === '') {
      console.error('Missing phone');
      alert('Please provide your phone number to proceed with payment.');
      return;
    }
    
    if (amount <= 0) {
      console.error('Invalid amount');
      alert('Invalid payment amount. Please check your cart and try again.');
      return;
    }
    
    // Use the global PaystackPop object that's loaded via script
    // Setup Paystack configuration
    const paystackConfig: any = {
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email,
      amount: amount * 100, // Paystack amount is in kobo (multiply by 100)
      ref: reference,
      firstname: name.split(' ')[0],
      lastname: name.split(' ').slice(1).join(' '),
      phone,
      currency: 'GHS',
      channels,
      label: `${name}'s Food Order`,
      onSuccess: (transaction: any) => {
        console.log('Payment successful!', transaction);
        // Make sure we're calling the success callback with a slight delay
        // This ensures the Paystack modal has time to close properly
        setTimeout(() => {
          console.log('Executing success callback with reference:', transaction.reference);
          onSuccess(transaction.reference);
        }, 500);
      },
      onCancel: onClose
    };
    
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
      {/* Load Paystack script */}
      <Script
        src="https://js.paystack.co/v1/inline.js"
        onLoad={handlePaystackScriptLoad}
        strategy="lazyOnload"
      />
      
      <Button 
        onClick={handlePayment}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
        disabled={!isClient}
      >
        {channels.includes('mobile_money') && !channels.includes('card') 
          ? 'Pay with Mobile Money' 
          : channels.includes('card') && !channels.includes('mobile_money')
          ? 'Pay with Card'
          : 'Make Payment'}
      </Button>
    </div>
  );
}
