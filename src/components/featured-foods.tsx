"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { IMenuItem } from '@/models/MenuItem';
import { Loader } from 'lucide-react';

const FeaturedFoods = () => {
  const [featuredFoods, setFeaturedFoods] = useState<IMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedFoods = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/menu-items?featured=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured menu items');
        }
        
        const data = await response.json();
        const items: IMenuItem[] = data.slice(0, 6); // Limit to 6 items
        
        setFeaturedFoods(items);
      } catch (err) {
        console.error('Error fetching featured foods:', err);
        setError('Failed to load featured dishes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedFoods();
  }, []);

  if (isLoading) {
    return (
      <section className="section-padding">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Dishes</h2>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-12 h-12 text-pink-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading featured dishes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Dishes</h2>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (featuredFoods.length === 0) {
    return (
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Dishes</h2>
          <p className="text-center text-gray-600 mb-8">
            No featured dishes available at the moment. Please check back later.
          </p>
          <div className="text-center">
            <Button asChild className="bg-pink-600 hover:bg-pink-700">
              <Link href="/menu">
                Browse All Menu Items
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Dishes</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore our most popular dishes from local and international cuisines, prepared with fresh ingredients and delivered to your campus.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredFoods.map((item) => (
            <div key={item.id} className="food-card bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
              <div className="relative h-48 w-full">
                <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 py-1 rounded-bl-lg z-10">
                  {item.category}
                </div>
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image 
                    src={item.imageUrl || '/placeholder-food.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {item.isFeatured && (
                    <div className="absolute top-0 left-0 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-br-md">
                      Popular
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-pink-600 font-bold">{formatPrice(item.price)}</span>
                  <Button asChild variant="outline" className="border-pink-500 text-pink-600 hover:bg-pink-50">
                    <Link href={`/menu/${item.id}`}>
                      Order Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild className="bg-pink-600 hover:bg-pink-700">
            <Link href="/menu">
              View Full Menu
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFoods;
