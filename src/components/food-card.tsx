"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Clock, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface FoodCardProps {
  food: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    restaurant: string;
    rating: number;
    preparationTime: number;
  };
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${food.name} has been added to your cart.`,
      duration: 3000,
    });
    // In a real app, this would dispatch to a cart state manager
  };

  return (
    <div className="food-card bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
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
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{food.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{food.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-2">{food.restaurant}</p>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{food.description}</p>
        
        <div className="flex items-center mb-4">
          <Clock className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-500">{food.preparationTime} mins</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-pink-600 font-bold">{formatPrice(food.price)}</span>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-pink-500 text-pink-600 hover:bg-pink-50"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1" /> Add
            </Button>
            <Button asChild size="sm" className="bg-pink-600 hover:bg-pink-700">
              <Link href={`/menu/${food.id}`}>
                View
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
