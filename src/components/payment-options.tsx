import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PaystackPayment from './paystack-payment';

interface PaymentOptionsProps {
  amount: number;
  email: string;
  name: string;
  phone: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export default function PaymentOptions({
  amount,
  email,
  name,
  phone,
  onSuccess,
  onClose,
}: PaymentOptionsProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<string>('mtn');

  const handlePaymentSuccess = (reference: string) => {
    onSuccess(reference);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Payment Method</h3>
        <p className="text-sm text-gray-500">
          Select your preferred payment method
        </p>
      </div>

      <RadioGroup
        value={paymentMethod}
        onValueChange={(value: string) => setPaymentMethod(value as 'mobile_money' | 'card')}
        className="grid grid-cols-2 gap-4"
      >
        <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:border-pink-500">
          <RadioGroupItem value="mobile_money" id="mobile_money" />
          <Label htmlFor="mobile_money" className="cursor-pointer">
            <div className="flex flex-col">
              <span className="font-medium">Mobile Money</span>
              <span className="text-xs text-gray-500">MTN, Vodafone, AirtelTigo</span>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:border-pink-500">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="cursor-pointer">
            <div className="flex flex-col">
              <span className="font-medium">Card Payment</span>
              <span className="text-xs text-gray-500">Visa, Mastercard</span>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {paymentMethod === 'mobile_money' && (
        <div className="mb-4">
          <Label htmlFor="mobile-money-provider" className="block mb-2 text-sm font-medium">
            Select Mobile Money Provider
          </Label>
          <Select 
            value={mobileMoneyProvider} 
            onValueChange={setMobileMoneyProvider}
          >
            <SelectTrigger id="mobile-money-provider" className="w-full">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mtn">MTN Mobile Money</SelectItem>
              <SelectItem value="vodafone">Vodafone Cash</SelectItem>
              <SelectItem value="airtel">AirtelTigo Money</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="pt-4">
        <PaystackPayment
          amount={amount}
          email={email}
          name={name}
          phone={phone}
          onSuccess={handlePaymentSuccess}
          onClose={onClose}
          channels={paymentMethod === 'mobile_money' ? ['mobile_money'] : ['card']}
          mobileMoneyProvider={paymentMethod === 'mobile_money' ? mobileMoneyProvider : undefined}
        />
      </div>
    </div>
  );
}
