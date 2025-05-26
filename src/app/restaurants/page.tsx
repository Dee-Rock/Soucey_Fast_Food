"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Star, MapPin, Clock, Loader } from 'lucide-react';
import { Restaurant } from '@/lib/firestore';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch restaurants from Firestore
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const restaurantsCollection = collection(db, 'restaurants');
        const restaurantsQuery = query(
          restaurantsCollection,
          where('status', '==', 'active'),
          orderBy('rating', 'desc')
        );
        
        const querySnapshot = await getDocs(restaurantsQuery);
        const restaurantsList: Restaurant[] = [];
        const featuredList: Restaurant[] = [];
        
        querySnapshot.forEach((doc) => {
          const restaurant = { id: doc.id, ...doc.data() } as Restaurant;
          restaurantsList.push(restaurant);
          
          if (restaurant.featured) {
            featuredList.push(restaurant);
          }
        });
        
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
                      <div className="absolute top-0 right-0 bg-pink-600 text-white px-3 py-1 rounded-bl-lg">
                        Featured
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{restaurant.address}</span>
                      </div>
                      <div className="flex items-center text-sm mb-2">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>{restaurant.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Delivery: {restaurant.deliveryTime} mins</span>
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
                    <div className="flex items-center text-sm mb-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{restaurant.rating.toFixed(1)}</span>
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
};

export default RestaurantsPage;
