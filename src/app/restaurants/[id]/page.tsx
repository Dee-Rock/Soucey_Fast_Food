"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Clock, MapPin, Phone, Globe, Utensils, Clock3 } from 'lucide-react';
import { IRestaurant } from '@/models/Restaurant';
import { formatPhoneNumber } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import MenuSection from '@/components/menu-section';
import RestaurantReviews from '@/components/restaurant-reviews';

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [averageRating, setAverageRating] = useState<number>(0);
  
  const handleReviewsUpdate = (reviews: any[]) => {
    if (reviews && reviews.length > 0) {
      const sum = reviews.reduce((total, review) => total + review.rating, 0);
      const avg = parseFloat((sum / reviews.length).toFixed(1));
      setAverageRating(avg);
    } else {
      setAverageRating(0);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      // Validate ID before making the request
      const restaurantId = params?.id;
      
      if (!restaurantId || restaurantId === 'undefined' || restaurantId === 'null') {
        console.error('Invalid restaurant ID:', restaurantId);
        setError('Invalid restaurant ID. Please try again.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching restaurant with ID: ${restaurantId}`);
        const response = await fetch(`/api/restaurants/${restaurantId}`, {
          cache: 'no-store' // Ensure we get fresh data
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || 'Failed to fetch restaurant details');
        }
        
        const data = await response.json();
        console.log('Restaurant data:', data);
        
        // Ensure we have valid restaurant data
        if (!data || (!data._id && !data.id)) {
          throw new Error('Invalid restaurant data received from server');
        }
        
        setRestaurant(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error fetching restaurant:', errorMessage);
        setError(`Failed to load restaurant details: ${errorMessage}`);
        toast({
          title: 'Error',
          description: `Failed to load restaurant details: ${errorMessage}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurant();
  }, [params.id, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Restaurants
          </Button>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-64 bg-gray-200 animate-pulse"></div>
            
            <div className="p-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex space-x-4 mb-6">
                  {['Menu', 'Reviews', 'Info'].map((tab) => (
                    <div key={tab} className="h-10 w-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="h-40 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-6 w-16 bg-gray-200 rounded"></div>
                          <div className="h-10 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            {error?.includes('not found') ? 'Restaurant Not Found' : 'Something went wrong'}
          </h2>
          <p className="mt-2 text-gray-600">
            {error || 'The restaurant you are looking for could not be found.'}
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Go Back
            </Button>
            <Button
              variant="default"
              onClick={() => router.push('/restaurants')}
              className="bg-pink-600 hover:bg-pink-700"
            >
              Browse Restaurants
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If this issue persists, please contact support with the following details:
            </p>
            <div className="mt-2 p-3 bg-gray-50 rounded-md text-left">
              <code className="text-xs break-all">
                Error: {error || 'Unknown error'}
                <br />
                ID: {params.id || 'N/A'}
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we get here, we have a valid restaurant
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 flex items-center text-gray-600 hover:text-pink-600"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Restaurants
      </Button>

      {/* Restaurant Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="relative h-64 md:h-80 w-full bg-gray-100">
          {restaurant.coverUrl ? (
            <Image
              src={restaurant.coverUrl}
              alt={restaurant.name}
              fill
              className="object-cover"
              priority
              unoptimized={process.env.NODE_ENV !== 'production'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{restaurant.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="ml-1 text-white">
                  {restaurant.rating?.toFixed(1) || '0.0'}
                </span>
              </div>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-gray-300">{restaurant.cuisineType}</span>
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">
                <MapPin className="inline-block w-5 h-5 mr-2 text-pink-600" />
                Address
              </h3>
              <p className="text-gray-600">{restaurant.address}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">
                <Clock3 className="inline-block w-5 h-5 mr-2 text-pink-600" />
                Opening Hours
              </h3>
              <p className="text-gray-600">
                {restaurant.openingTime && restaurant.closingTime 
                  ? `${restaurant.openingTime} - ${restaurant.closingTime}`
                  : '9:00 AM - 10:00 PM'}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">
                <Clock className="inline-block w-5 h-5 mr-2 text-pink-600" />
                Delivery Time
              </h3>
              <p className="text-gray-600">{restaurant.deliveryTime} minutes</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3">About</h3>
            <p className="text-gray-600">
              {restaurant.description || 'No description available.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'menu'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Info
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-12">
        {activeTab === 'menu' && restaurant && (
          <MenuSection 
            restaurantId={params.id}
            restaurantName={restaurant.name}
            deliveryFee={restaurant.deliveryFee || 0}
          />
        )}
        
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow p-6">
            <RestaurantReviews 
              restaurantId={params.id} 
              onReviewsUpdate={handleReviewsUpdate} 
            />
          </div>
        )}
        
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Restaurant Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100">Contact Details</h3>
                    <div className="space-y-4">
                      {restaurant.address && (
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <MapPin className="w-5 h-5 text-pink-600 mt-0.5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Address</p>
                            <p className="text-gray-800">{restaurant.address}</p>
                          </div>
                        </div>
                      )}
                      
                      {restaurant.phone && (
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Phone className="w-5 h-5 text-pink-600 mt-0.5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <a 
                              href={`tel:${restaurant.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {formatPhoneNumber(restaurant.phone)}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {restaurant.email && (
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-pink-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <a 
                              href={`mailto:${restaurant.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {restaurant.email}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {restaurant.website && (
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Globe className="w-5 h-5 text-pink-600 mt-0.5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Website</p>
                            <a 
                              href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {restaurant.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Cuisine & Hours */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100">Cuisine & Hours</h3>
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Utensils className="w-5 h-5 text-pink-600 mt-0.5" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Cuisine</p>
                          <p className="text-gray-800">{restaurant.cuisineType || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Clock3 className="w-5 h-5 text-pink-600 mt-0.5" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Opening Hours</p>
                          <p className="text-gray-800">
                            {restaurant.openingTime && restaurant.closingTime 
                              ? `${restaurant.openingTime} - ${restaurant.closingTime}`
                              : 'Not specified'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Clock className="w-5 h-5 text-pink-600 mt-0.5" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Delivery Time</p>
                          <p className="text-gray-800">{restaurant.deliveryTime} minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Restaurant Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100">About {restaurant.name}</h3>
                  <div className="prose max-w-none text-gray-600">
                    {restaurant.description ? (
                      <p className="whitespace-pre-line">{restaurant.description}</p>
                    ) : (
                      <p className="text-gray-500 italic">No description available for this restaurant.</p>
                    )}
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Delivery Fee</p>
                        <p className="text-lg font-semibold text-gray-800">
                          GH₵{(restaurant.deliveryFee !== undefined ? restaurant.deliveryFee : 0.48).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Rating</p>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                          <span className="font-semibold text-gray-800">
                            {averageRating.toFixed(1)}
                            <span className="text-gray-400 font-normal ml-1">/ 5.0</span>
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {restaurant.totalOrders !== undefined ? restaurant.totalOrders.toLocaleString() : '0'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
