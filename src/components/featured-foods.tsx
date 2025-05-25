"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

// Sample featured food data
const featuredFoods = [
  {
    id: 1,
    name: 'Jollof Rice with Chicken',
    description: 'Spicy Ghanaian jollof rice served with grilled chicken and vegetables',
    price: 35.99,
    image: '/jollof-rice.jpg',
    category: 'Local Dishes',
  },
  {
    id: 2,
    name: 'Banku with Tilapia',
    description: 'Traditional Ghanaian banku served with grilled tilapia and hot pepper sauce',
    price: 45.99,
    image: '/banku-tilapia.jpg',
    category: 'Local Dishes',
  },
  {
    id: 3,
    name: 'Waakye Special',
    description: 'Rice and beans dish served with spaghetti, meat, fish, and gari',
    price: 40.99,
    image: '/waakye.jpg',
    category: 'Local Dishes',
  },
  {
    id: 4,
    name: 'Chicken Burger',
    description: 'Juicy chicken burger with lettuce, tomato, cheese, and special sauce',
    price: 30.99,
    image: '/chicken-burger.jpg',
    category: 'Fast Food',
  },
  {
    id: 5,
    name: 'Pizza Supreme',
    description: 'Delicious pizza topped with pepperoni, sausage, bell peppers, and cheese',
    price: 55.99,
    image: '/pizza.jpg',
    category: 'Fast Food',
  },
  {
    id: 6,
    name: 'Fried Rice with Chicken',
    description: 'Flavorful fried rice with vegetables, eggs, and grilled chicken',
    price: 38.99,
    image: '/fried-rice.jpg',
    category: 'Local Dishes',
  },
];

const FeaturedFoods = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Dishes</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore our most popular dishes from local and international cuisines, prepared with fresh ingredients and delivered to your campus.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredFoods.map((food) => (
            <div key={food.id} className="food-card bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
              <div className="relative h-48 w-full">
                <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 py-1 rounded-bl-lg z-10">
                  {food.category}
                </div>
                <div className="w-full h-full relative">
                  <Image
                    src={food.image}
                    alt={food.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{food.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{food.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-pink-600 font-bold">{formatPrice(food.price)}</span>
                  <Button asChild variant="outline" className="border-pink-500 text-pink-600 hover:bg-pink-50">
                    <Link href={`/menu/${food.id}`}>
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
