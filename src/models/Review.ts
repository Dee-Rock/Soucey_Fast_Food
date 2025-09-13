import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: string;  // Changed from mongoose.Types.ObjectId to string for Clerk's user ID
  restaurantId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  userName: string;
  userAvatar?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { 
      type: Schema.Types.Mixed, // Use Mixed type to be more permissive
      required: true,
      set: (v: any) => String(v) // Ensure it's always converted to string
    },
    restaurantId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Restaurant', 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    comment: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 1000
    },
    userName: { 
      type: String, 
      required: true 
    },
    userAvatar: { 
      type: String,
      default: ''
    },
    images: [{
      type: String
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster querying
reviewSchema.index({ restaurantId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, restaurantId: 1 });

// Check if model is already compiled
if (mongoose.models.Review) {
  delete mongoose.models.Review;
}

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
