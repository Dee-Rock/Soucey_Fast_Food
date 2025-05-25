"use client"

import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface FlutterwavePaymentProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
  onSuccess: () => void;
}

const FlutterwavePayment: React.FC<FlutterwavePaymentProps> = ({
  amount,
  customerName,
  customerEmail,
  customerPhone,
  orderId,
  onSuccess
}) => {
  const { toast } = useToast();

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
    tx_ref: orderId,
    amount: amount,
    currency: 'GHS',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: customerEmail,
      phone_number: customerPhone,
      name: customerName,
    },
    customizations: {
      title: 'Soucey Food Ordering',
      description: 'Payment for food order',
      logo: 'https://yourdomain.com/logo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const initiatePayment = () => {
    handleFlutterPayment({
      callback: (response) => {
        console.log(response);
        if (response.status === "successful") {
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully.",
            duration: 5000,
          });
          onSuccess();
        } else {
          toast({
            title: "Payment Failed",
            description: "There was an issue processing your payment. Please try again.",
            variant: "destructive",
            duration: 5000,
          });
        }
        closePaymentModal();
      },
      onClose: () => {
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment process.",
          duration: 3000,
        });
      },
    });
  };

  return (
    <Button 
      onClick={initiatePayment}
      className="w-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center"
    >
      Pay with Flutterwave
    </Button>
  );
};

export default FlutterwavePayment;
