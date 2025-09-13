import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Review from '@/models/Review';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    
    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }
    
    // Ensure restaurantId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return NextResponse.json(
        { error: 'Invalid restaurant ID format' },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ 
      restaurantId: new mongoose.Types.ObjectId(restaurantId) 
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
    
    return NextResponse.json({ reviews });
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// Helper function to check if user is authorized to modify a review
async function isAuthorized(reviewId: string, userId: string) {
  const review = await Review.findById(reviewId);
  return review && review.userId === userId;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { restaurantId, rating, comment, userName, userAvatar } = body;
    
    // Basic validation
    if (!restaurantId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user has already reviewed this restaurant
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return NextResponse.json(
        { error: 'Invalid restaurant ID format' },
        { status: 400 }
      );
    }

    // Allow multiple reviews per user
    // We'll just create a new review each time
    
    // Create new review with explicit type casting
    const reviewData = {
      userId: String(clerkUserId), // Ensure it's a string
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      rating: Number(rating),
      comment: String(comment),
      userName: String(userName || 'Anonymous'),
      userAvatar: String(userAvatar || '')
    };
    
    console.log('Creating review with data:', reviewData);
    const review = new Review(reviewData);
    
    try {
      await review.save();
      // Update restaurant's average rating (we'll implement this later)
      await updateRestaurantRating(restaurantId);
    } catch (saveError) {
      console.error('Error saving review:', saveError);
      if (saveError instanceof Error) {
        return NextResponse.json(
          { error: `Failed to save review: ${saveError.message}` },
          { status: 500 }
        );
      }
      throw saveError;
    }
    
    return NextResponse.json({ 
      message: 'Review submitted successfully',
      review 
    });
    
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const { userId: clerkUserId } = auth();
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { reviewId, rating, comment } = await request.json();
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Check if user is authorized to edit this review
    if (!await isAuthorized(reviewId, clerkUserId)) {
      return NextResponse.json(
        { error: 'Not authorized to edit this review' },
        { status: 403 }
      );
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { 
        $set: { 
          rating: Number(rating),
          comment: String(comment),
          updatedAt: new Date()
        } 
      },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Update restaurant's average rating
    await updateRestaurantRating(updatedReview.restaurantId.toString());

    return NextResponse.json({ 
      message: 'Review updated successfully',
      review: updatedReview 
    });

  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { userId: clerkUserId } = auth();
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Check if user is authorized to delete this review
    if (!await isAuthorized(reviewId, clerkUserId)) {
      return NextResponse.json(
        { error: 'Not authorized to delete this review' },
        { status: 403 }
      );
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Update restaurant's average rating
    await updateRestaurantRating(deletedReview.restaurantId.toString());

    return NextResponse.json({ 
      message: 'Review deleted successfully',
      review: deletedReview 
    });

  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}

// Helper function to update restaurant's average rating
async function updateRestaurantRating(restaurantId: string) {
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    console.error('Invalid restaurantId:', restaurantId);
    return;
  }
  try {
    const result = await Review.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
      { 
        $group: {
          _id: '$restaurantId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);
    
    if (result.length > 0) {
      const { averageRating, reviewCount } = result[0];
      
      // Update the restaurant document
      await mongoose.model('Restaurant').findByIdAndUpdate(
        restaurantId,
        { 
          $set: { 
            rating: parseFloat(averageRating.toFixed(1)),
            reviewCount
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error updating restaurant rating:', error);
  }
}
