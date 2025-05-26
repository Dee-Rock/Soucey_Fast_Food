// Type definitions for Paystack
interface PaystackPopInterface {
  setup(options: PaystackOptions): PaystackInstance;
}

interface PaystackInstance {
  openIframe(): void;
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  ref?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  currency?: string;
  channels?: string[];
  label?: string;
  metadata?: Record<string, any>;
  onSuccess: (transaction: PaystackResponse) => void;
  onCancel: () => void;
  [key: string]: any;
}

interface PaystackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
  [key: string]: any;
}

// Export types for use in components
export type PaystackProps = PaystackOptions;

// Extend Window interface to include PaystackPop
declare global {
  interface Window {
    PaystackPop: PaystackPopInterface;
  }
}
