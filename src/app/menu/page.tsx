"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter } from 'lucide-react';
import FoodCard from '@/components/food-card';
import { formatPrice } from '@/lib/utils';

// Sample food data
const foodItems = [
  {
    id: 1,
    name: 'Jollof Rice with Chicken',
    description: 'Spicy Ghanaian jollof rice served with grilled chicken and vegetables',
    price: 35.99,
    image: '/jollof-rice.jpg',
    category: 'Local Dishes',
    restaurant: 'Ghana Kitchen',
    rating: 4.8,
    preparationTime: 25,
  },
  {
    id: 2,
    name: 'Banku with Tilapia',
    description: 'Traditional Ghanaian banku served with grilled tilapia and hot pepper sauce',
    price: 45.99,
    image: '/banku-tilapia.jpg',
    category: 'Local Dishes',
    restaurant: 'Accra Delights',
    rating: 4.7,
    preparationTime: 30,
  },
  {
    id: 3,
    name: 'Waakye Special',
    description: 'Rice and beans dish served with spaghetti, meat, fish, and gari',
    price: 40.99,
    image: '/waakye.jpg',
    category: 'Local Dishes',
    restaurant: 'Street Food Hub',
    rating: 4.6,
    preparationTime: 20,
  },
  {
    id: 4,
    name: 'Chicken Burger',
    description: 'Juicy chicken burger with lettuce, tomato, cheese, and special sauce',
    price: 30.99,
    image: '/chicken-burger.jpg',
    category: 'Fast Food',
    restaurant: 'Burger Palace',
    rating: 4.5,
    preparationTime: 15,
  },
  {
    id: 5,
    name: 'Pizza Supreme',
    description: 'Delicious pizza topped with pepperoni, sausage, bell peppers, and cheese',
    price: 55.99,
    image: '/pizza.jpg',
    category: 'Fast Food',
    restaurant: 'Pizza Corner',
    rating: 4.9,
    preparationTime: 25,
  },
  {
    id: 6,
    name: 'Fried Rice with Chicken',
    description: 'Flavorful fried rice with vegetables, eggs, and grilled chicken',
    price: 38.99,
    image: '/fried-rice.jpg',
    category: 'Local Dishes',
    restaurant: 'Ghana Kitchen',
    rating: 4.7,
    preparationTime: 20,
  },
  {
    id: 7,
    name: 'Fufu with Light Soup',
    description: 'Traditional fufu served with light soup and assorted meat',
    price: 42.99,
    image: '/fufu.jpg',
    category: 'Local Dishes',
    restaurant: 'Accra Delights',
    rating: 4.8,
    preparationTime: 35,
  },
  {
    id: 8,
    name: 'Shawarma',
    description: 'Grilled chicken or beef wrapped in pita bread with vegetables and sauce',
    price: 25.99,
    image: '/shawarma.jpg',
    category: 'Fast Food',
    restaurant: 'Mediterranean Bites',
    rating: 4.6,
    preparationTime: 10,
  },
  {
    id: 9,
    name: 'Vegetable Salad',
    description: 'Fresh mixed vegetables with dressing and grilled chicken strips',
    price: 28.99,
    image: '/salad.jpg',
    category: 'Healthy',
    restaurant: 'Green Plate',
    rating: 4.5,
    preparationTime: 15,
  },
  {
    id: 10,
    name: 'Fruit Smoothie',
    description: 'Refreshing blend of seasonal fruits with yogurt',
    price: 15.99,
    image: '/smoothie.jpg',
    category: 'Drinks',
    restaurant: 'Juice Bar',
    rating: 4.7,
    preparationTime: 5,
  },
  {
    id: 11,
    name: 'Red Red',
    description: 'Beans stew with fried plantain, a popular Ghanaian dish',
    price: 32.99,
    image: '/red-red.jpg',
    category: 'Local Dishes',
    restaurant: 'Street Food Hub',
    rating: 4.6,
    preparationTime: 25,
  },
  {
    id: 12,
    name: 'Kelewele',
    description: 'Spicy fried plantain cubes, a popular Ghanaian snack',
    price: 18.99,
    image: '/kelewele.jpg',
    category: 'Snacks',
    restaurant: 'Accra Delights',
    rating: 4.8,
    preparationTime: 15,
  },
];

// Categories
const categories = ['All', 'Local Dishes', 'Fast Food', 'Healthy', 'Snacks', 'Drinks'];

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');

  // Filter foods based on search query and active category
  const filteredFoods = foodItems.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         food.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || food.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort foods based on selected criteria
  const sortedFoods = [...filteredFoods].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    } else if (sortBy === 'price-high') {
      return b.price - a.price;
    } else if (sortBy === 'preparation') {
      return a.preparationTime - b.preparationTime;
    } else {
      // Default: sort by popularity (rating)
      return b.rating - a.rating;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Menu</h1>
      <p className="text-gray-600 mb-8">Explore our wide variety of delicious meals</p>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for food, restaurants..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setSortBy(sortBy === 'popularity' ? 'price-low' : 'popularity')}
          >
            <Filter className="w-4 h-4" />
            <span>Sort by: {sortBy === 'popularity' ? 'Popularity' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Preparation Time'}</span>
          </Button>
        </div>
      </div>
      
      {/* Categories Tabs */}
      <Tabs defaultValue="All" className="mb-8">
        <TabsList className="mb-4 flex flex-wrap">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category ? 'bg-pink-100 text-pink-600' : ''}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Food Items Grid */}
      {sortedFoods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No food items found matching your criteria.</p>
          <Button 
            variant="link" 
            className="text-pink-600 mt-2"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
