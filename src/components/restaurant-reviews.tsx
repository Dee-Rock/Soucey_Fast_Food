'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, StarHalf, User, Pencil, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface Review {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  images?: string[];
}
interface RestaurantReviewsProps {
  restaurantId: string;
  onReviewsUpdate?: (reviews: Review[]) => void;
}

export default function RestaurantReviews({ 
  restaurantId, 
  onReviewsUpdate 
}: RestaurantReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<{
    id: string | null;
    rating: number;
    comment: string;
  }>({ id: null, rating: 0, comment: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    // Calculate average rating from reviews
    const calculateAverageRating = (reviews: Review[]): number => {
      if (!reviews.length) return 0;
      const sum = reviews.reduce((total, review) => total + review.rating, 0);
      return parseFloat((sum / reviews.length).toFixed(1));
    };

    // Notify parent component when reviews change
    if (onReviewsUpdate) {
      onReviewsUpdate(reviews);
    }
  }, [reviews, onReviewsUpdate]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reviews?restaurantId=${restaurantId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast({
          title: 'Error',
          description: 'Failed to load reviews',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantId, toast]);

  const handleStartEdit = (review: Review) => {
    setEditingReview({
      id: review._id,
      rating: review.rating,
      comment: review.comment
    });
    setRating(review.rating);
    setComment(review.comment);
    // Scroll to the review form
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingReview({ id: null, rating: 0, comment: '' });
    setRating(0);
    setComment('');
  };

  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    
    try {
      setSubmitting(true);
      const response = await fetch(`/api/reviews?reviewId=${reviewToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete review');
      }

      const data = await response.json();
      setReviews(reviews.filter(review => review._id !== data.review._id));
      
      toast({
        title: 'Success',
        description: 'Your review has been deleted',
      });
      
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete review',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to leave a review',
        variant: 'destructive',
      });
      return;
    }

    if (!rating) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: 'Comment too short',
        description: 'Please write at least 10 characters',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      
      let response;
      if (editingReview.id) {
        // Update existing review
        response = await fetch('/api/reviews', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviewId: editingReview.id,
            rating,
            comment,
          }),
        });
      } else {
        // Create new review
        response = await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurantId,
            rating,
            comment,
            userName: user.fullName || user.firstName || 'Anonymous',
            userAvatar: user.imageUrl || '',
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
      }

      const data = await response.json();
      
      if (editingReview.id) {
        // Update existing review in the list
        setReviews(reviews.map(review => 
          review._id === editingReview.id ? data.review : review
        ));
        
        toast({
          title: 'Review updated',
          description: 'Your review has been updated successfully!',
        });
      } else {
        // Add new review to the list
        setReviews([data.review, ...reviews]);
        
        toast({
          title: 'Review submitted',
          description: 'Thank you for your review!',
        });
      }
      
      // Reset form
      setEditingReview({ id: null, rating: 0, comment: '' });
      setComment('');
      setRating(0);
      
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-5 h-5 text-yellow-400 fill-current" />);
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Review Form */}
      <div id="review-form" className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingReview.id ? 'Edit Your Review' : 'Write a Review'}
        </h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Your Rating</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {(hoverRating || rating) >= star ? (
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  ) : (
                    <Star className="w-6 h-6 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Your Review
            </label>
            <Textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full"
              disabled={!isSignedIn || submitting}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            {editingReview.id && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={!isSignedIn || submitting || !rating || comment.trim().length < 10}
              onClick={() => {
                console.log('Submit button state:', {
                  isSignedIn,
                  submitting,
                  rating,
                  commentLength: comment.trim().length,
                  disabled: !isSignedIn || submitting || !rating || comment.trim().length < 10
                });
              }}
            >
              {submitting 
                ? 'Saving...' 
                : editingReview.id 
                  ? 'Update Review' 
                  : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="relative bg-white p-4 rounded-lg shadow">
              {/* Edit/Delete buttons for the review owner */}
              {isSignedIn && user?.id === review.userId && (
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => handleStartEdit(review)}
                    className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                    disabled={submitting}
                    aria-label="Edit review"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(review._id)}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    disabled={submitting}
                    aria-label="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{review.userName}</p>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
              
              {review.images && review.images.length > 0 && (
                <div className="mt-3 flex space-x-2 overflow-x-auto">
                  {review.images.map((image, idx) => (
                    <div key={idx} className="w-20 h-20 flex-shrink-0">
                      <img 
                        src={image} 
                        alt={`Review image ${idx + 1}`} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteReview}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? 'Deleting...' : 'Delete Review'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
