"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/add-to-cart-button';

interface FoodCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  restaurant?: string;
  rating?: number;
  preparationTime?: string | number;
  popular?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = (props) => {

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 w-full">
        {props.category && (
          <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 py-1 rounded-bl-lg z-10">
            {props.category}
          </div>
        )}
        {props.popular && (
          <div className="absolute top-0 left-0 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-br-md">
            Popular
          </div>
        )}
        <div className="w-full h-full relative">
          <Image
            src={props.image || '/images/placeholder-food.jpg'}
            alt={props.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            quality={75}
            onError={(e: any) => {
              e.target.src = '/images/placeholder-food.jpg';
            }}
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{props.name}</h3>
          {props.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{props.rating}</span>
            </div>
          )}
        </div>
        
        {props.description && (
          <p className="text-gray-600 mb-4 text-sm line-clamp-2">{props.description}</p>
        )}
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-pink-600 font-bold">{formatPrice(props.price)}</span>
          {props.preparationTime && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{props.preparationTime} mins</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          {props.restaurant && (
            <span className="text-xs text-gray-500">{props.restaurant}</span>
          )}
          
          <div className="flex space-x-2">
            <Button asChild variant="outline" size="sm" className="text-xs h-8 px-3">
              <Link href={`/menu/${props.id}`}>
                Details
              </Link>
            </Button>
            
            <AddToCartButton 
              item={{
                id: props.id.toString(),
                name: props.name,
                price: props.price,
                restaurant: props.restaurant || 'Unknown',
                image: props.image || '/placeholder-food.jpg'
              }} 
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
