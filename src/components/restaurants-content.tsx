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
        const restaurantsList: IRestaurant[] = data;
        const featuredList: IRestaurant[] = data.filter((restaurant: IRestaurant) => restaurant.featuredRestaurant);
        
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
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="w-12 h-12 text-pink-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          {error}
        </div>
      )}
      
      {!isLoading && !error && (
        <>
          {/* Featured Restaurants */}
          {featuredRestaurants.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Featured Restaurants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRestaurants.map((restaurant) => (
                  <Link 
                    key={restaurant.id} 
                    href={`/restaurants/${restaurant.id}`}
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
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{restaurant.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{restaurant.rating?.toFixed(1) || '0.0'}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{restaurant.address}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* All Restaurants */}
          <h2 className="text-2xl font-bold mb-4">All Restaurants</h2>
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Link 
                  key={restaurant.id} 
                  href={`/restaurants/${restaurant.id}`}
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
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{restaurant.rating?.toFixed(1) || '0.0'}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Delivery: {restaurant.deliveryTime} mins</span>
                    </div>
                  </div>
                </Link>
              ))}
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