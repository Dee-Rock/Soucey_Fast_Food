import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  customer: string;
  amount: string;
  method: 'mobile_money' | 'card' | 'cash';
  provider: string;
  status: 'successful' | 'pending' | 'refunded' | 'failed';
  reference: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    orderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Order',
      required: true 
    },
    customer: { type: String, required: true },
    amount: { type: String, required: true },
    method: { 
      type: String, 
      enum: ['mobile_money', 'card', 'cash'], 
      required: true 
    },
    provider: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['successful', 'pending', 'refunded', 'failed'], 
      default: 'pending' 
    },
    reference: { type: String, required: true },
    date: { type: String, required: true }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
