"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Star, MapPin, Clock } from 'lucide-react';

// Sample restaurant data
const restaurants = [
  {
    id: 1,
    name: 'Ghana Kitchen',
    description: 'Authentic Ghanaian cuisine with a modern twist',
    logo: '/ghana-kitchen-logo.jpg',
    banner: '/ghana-kitchen-banner.jpg',
    address: 'University Road, Accra',
    rating: 4.8,
    deliveryTime: '20-35',
    categories: ['Local Dishes', 'Soups', 'Rice Dishes'],
    featured: true,
  },
  {
    id: 2,
    name: 'Accra Delights',
    description: 'Traditional Ghanaian food made with love',
    logo: '/accra-delights-logo.jpg',
    banner: '/accra-delights-banner.jpg',
    address: 'Campus Square, Legon',
    rating: 4.7,
    deliveryTime: '25-40',
    categories: ['Local Dishes', 'Grilled', 'Breakfast'],
    featured: true,
  },
  {
    id: 3,
    name: 'Street Food Hub',
    description: 'Popular street food from all over Ghana',
    logo: '/street-food-logo.jpg',
    banner: '/street-food-banner.jpg',
    address: 'Market Street, Accra',
    rating: 4.6,
    deliveryTime: '15-30',
    categories: ['Street Food', 'Snacks', 'Local Dishes'],
    featured: false,
  },
  {
    id: 4,
    name: 'Burger Palace',
    description: 'Juicy burgers and crispy fries',
    logo: '/burger-palace-logo.jpg',
    banner: '/burger-palace-banner.jpg',
    address: 'Mall Road, Accra',
    rating: 4.5,
    deliveryTime: '15-25',
    categories: ['Fast Food', 'Burgers', 'Fries'],
    featured: true,
  },
  {
    id: 5,
    name: 'Pizza Corner',
    description: 'Authentic Italian pizza with a Ghanaian twist',
    logo: '/pizza-corner-logo.jpg',
    banner: '/pizza-corner-banner.jpg',
    address: 'Central Avenue, Accra',
    rating: 4.9,
    deliveryTime: '25-40',
    categories: ['Pizza', 'Italian', 'Fast Food'],
    featured: true,
  },
  {
    id: 6,
    name: 'Mediterranean Bites',
    description: 'Healthy and delicious Mediterranean cuisine',
    logo: '/mediterranean-logo.jpg',
    banner: '/mediterranean-banner.jpg',
    address: 'Health Street, Accra',
    rating: 4.6,
    deliveryTime: '20-35',
    categories: ['Mediterranean', 'Healthy', 'Shawarma'],
    featured: false,
  },
  {
    id: 7,
    name: 'Green Plate',
    description: 'Fresh salads and healthy food options',
    logo: '/green-plate-logo.jpg',
    banner: '/green-plate-banner.jpg',
    address: 'Fitness Avenue, Legon',
    rating: 4.5,
    deliveryTime: '15-30',
    categories: ['Healthy', 'Salads', 'Wraps'],
    featured: false,
  },
  {
    id: 8,
    name: 'Juice Bar',
    description: 'Refreshing juices, smoothies, and light snacks',
    logo: '/juice-bar-logo.jpg',
    banner: '/juice-bar-banner.jpg',
    address: 'Fruit Street, Accra',
    rating: 4.7,
    deliveryTime: '10-20',
    categories: ['Drinks', 'Smoothies', 'Healthy'],
    featured: false,
  },
];

const RestaurantsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Filter restaurants based on search query and filter
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'featured' && restaurant.featured) ||
                         restaurant.categories.some(cat => cat.toLowerCase() === filter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Restaurants</h1>
      <p className="text-gray-600 mb-8">Discover the best food from local restaurants</p>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for restaurants, cuisines..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            className={filter === 'all' ? 'bg-pink-600 hover:bg-pink-700' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'featured' ? 'default' : 'outline'}
            className={filter === 'featured' ? 'bg-pink-600 hover:bg-pink-700' : ''}
            onClick={() => setFilter('featured')}
          >
            Featured
          </Button>
          <Button
            variant={filter === 'local dishes' ? 'default' : 'outline'}
            className={filter === 'local dishes' ? 'bg-pink-600 hover:bg-pink-700' : ''}
            onClick={() => setFilter('local dishes')}
          >
            Local Dishes
          </Button>
          <Button
            variant={filter === 'fast food' ? 'default' : 'outline'}
            className={filter === 'fast food' ? 'bg-pink-600 hover:bg-pink-700' : ''}
            onClick={() => setFilter('fast food')}
          >
            Fast Food
          </Button>
          <Button
            variant={filter === 'healthy' ? 'default' : 'outline'}
            className={filter === 'healthy' ? 'bg-pink-600 hover:bg-pink-700' : ''}
            onClick={() => setFilter('healthy')}
          >
            Healthy
          </Button>
        </div>
      </div>
      
      {/* Restaurant Grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
                <div className="relative h-48 w-full">
                  {restaurant.featured && (
                    <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 py-1 rounded-bl-lg z-10">
                      Featured
                    </div>
                  )}
                  <Image
                    src={restaurant.banner}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <Image
                        src={restaurant.logo}
                        alt={`${restaurant.name} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{restaurant.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.categories.slice(0, 3).map((category, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{restaurant.deliveryTime} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-500">No restaurants found matching your criteria.</p>
          <Button 
            variant="link" 
            className="text-pink-600 mt-2"
            onClick={() => {
              setSearchQuery('');
              setFilter('all');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
