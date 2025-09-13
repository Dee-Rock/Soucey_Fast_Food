"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Star, MapPin, Clock, Loader } from 'lucide-react';
import { IRestaurant } from '@/models/Restaurant';
import Image from 'next/image';
import Link from 'next/link';

export default function RestaurantsContent() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<IRestaurant[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<IRestaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch restaurants from MongoDB API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/restaurants');
        
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        
        const data = await response.json();
        
        // Ensure all restaurants have proper ID fields
        const normalizeRestaurant = (restaurant: any): IRestaurant => ({
          ...restaurant,
          _id: restaurant._id?.toString(),
          id: restaurant._id?.toString() || restaurant.id
        });
        
        const restaurantsList: IRestaurant[] = data.map(normalizeRestaurant);
        const featuredList = restaurantsList.filter(restaurant => restaurant.featuredRestaurant);
        
        setRestaurants(restaurantsList);
        setFilteredRestaurants(restaurantsList);
        setFeaturedRestaurants(featuredList);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);
  
  // Filter restaurants based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredRestaurants(restaurants);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = restaurants.filter(
      restaurant => 
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.address.toLowerCase().includes(query) ||
        restaurant.cuisineType.toLowerCase().includes(query)
    );
    
    setFilteredRestaurants(filtered);
  }, [searchQuery, restaurants]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Restaurants</h1>
      <p className="text-gray-600 mb-8">Explore our partner restaurants and their delicious offerings</p>
      
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input 
          className="pl-10" 
          placeholder="Search restaurants by name, location, cuisine..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          <p className="font-medium">Error loading restaurants</p>
          <p className="text-sm">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      )}
      
      {!isLoading && !error && (
        <>
          {/* Featured Restaurants */}
          {featuredRestaurants.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Featured Restaurants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRestaurants.map((restaurant) => {
                  const restaurantId = restaurant.id || restaurant._id?.toString();
                  return (
                  <Link 
                    key={restaurantId} 
                    href={`/restaurants/${restaurantId}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 w-full">
                      <Image 
                        src={restaurant.logo || '/restaurant-placeholder.jpg'} 
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                      {restaurant.featuredRestaurant && (
                        <div className="absolute top-0 left-0 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-br-md">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{restaurant.rating?.toFixed(1) || '0.0'}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{restaurant.deliveryTime} min</span>
                      </div>
                    </div>
                  </Link>
                );
                })}
              </div>
            </div>
          )}
          
          {/* All Restaurants */}
          <h2 className="text-2xl font-bold mb-4">All Restaurants</h2>
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => {
                const restaurantId = restaurant.id || restaurant._id?.toString();
                return (
                <Link 
                  key={restaurantId} 
                  href={`/restaurants/${restaurantId}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    <Image 
                      src={restaurant.logo || '/restaurant-placeholder.jpg'} 
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{restaurant.rating?.toFixed(1) || '0.0'}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{restaurant.deliveryTime} min</span>
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No restaurants found matching your search criteria.</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 