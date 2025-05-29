import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

type PaymentMethod = 'mobile_money' | 'card' | 'cash';

interface PaymentOptionsProps {
  amount: number;
  email: string;
  name: string;
  phone: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export default function PaymentOptions({
  amount,
  email,
  name,
  phone,
  onSuccess,
  onClose,
  onPlaceOrder,
  isSubmitting,
  selectedMethod,
  onSelectMethod,
}: PaymentOptionsProps) {
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<string>('mtn');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mobile_money');

  // Rely on parent component for form validation
  const handlePaymentClick = () => {
    // Clear any previous validation errors
    setValidationError(null);
    // Trigger the parent's place order handler
    onPlaceOrder();
  };

  const handlePaymentSuccess = (reference: string) => {
    onSuccess(reference);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setValidationError(null);
    setPaymentMethod(method);
    onSelectMethod(method);
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
        value={selectedMethod}
        onValueChange={(value: string) => handlePaymentMethodSelect(value as 'mobile_money' | 'card')}
        className="grid grid-cols-2 gap-4"
      >
        <div className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer transition-colors ${
          selectedMethod === 'mobile_money' ? 'border-pink-500 bg-pink-50' : 'hover:border-pink-300'
        }`}>
          <RadioGroupItem value="mobile_money" id="mobile_money" />
          <Label htmlFor="mobile_money" className="cursor-pointer">
            <div className="flex flex-col">
              <span className="font-medium">Mobile Money</span>
              <span className="text-xs text-gray-500">MTN, Vodafone, AirtelTigo</span>
            </div>
          </Label>
        </div>

        <div className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer transition-colors ${
          selectedMethod === 'card' ? 'border-pink-500 bg-pink-50' : 'hover:border-pink-300'
        }`}>
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="cursor-pointer">
            <div className="flex flex-col">
              <span className="font-medium">Card Payment</span>
              <span className="text-xs text-gray-500">Visa, Mastercard</span>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {selectedMethod === 'mobile_money' && (
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

      {/* Display validation error if any */}
      {validationError && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {validationError}
        </div>
      )}

      <div className="pt-2">
        <Button
          onClick={handlePaymentClick}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay GHS ${(amount / 100).toFixed(2)} with ${selectedMethod === 'mobile_money' ? 'Mobile Money' : 'Card'}`
          )}
        </Button>
      </div>
    </div>
  );
}
