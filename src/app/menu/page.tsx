"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Loader } from 'lucide-react';
import FoodCard from '@/components/food-card';
import { formatPrice } from '@/lib/utils';
import { MenuItem } from '@/lib/firestore';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const MenuPage = () => {
  const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch food items from Firestore
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setIsLoading(true);
        const menuItemsCollection = collection(db, 'menuItems');
        const menuItemsQuery = query(
          menuItemsCollection,
          where('available', '==', true),
          orderBy('popular', 'desc')
        );
        
        const querySnapshot = await getDocs(menuItemsQuery);
        const items: MenuItem[] = [];
        const categorySet = new Set<string>();
        
        querySnapshot.forEach((doc) => {
          const item = { id: doc.id, ...doc.data() } as MenuItem;
          items.push(item);
          if (item.category) {
            categorySet.add(item.category);
          }
        });
        
        setFoodItems(items);
        setFilteredItems(items);
        setCategories(Array.from(categorySet));
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFoodItems();
  }, []);
  
  // Filter items based on search query and category
  useEffect(() => {
    let result = [...foodItems];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.restaurant.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(result);
  }, [searchQuery, selectedCategory, foodItems]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Menu</h1>
      <p className="text-gray-600 mb-8">Discover delicious food from our partner restaurants</p>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            className="pl-10" 
            placeholder="Search for food, restaurants..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="w-12 h-12 text-pink-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          {error}
        </div>
      )}
      
      {/* Category Tabs */}
      {!isLoading && !error && (
        <Tabs defaultValue="all" className="mb-8" onValueChange={setSelectedCategory}>
          <TabsList className="mb-4 flex flex-wrap h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
          
          {/* Food Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 mb-4">No menu items found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default MenuPage;
