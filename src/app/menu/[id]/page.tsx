"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  restaurant: string | { name: string; id: string };
  rating?: number;
  preparationTime?: number;
  calories?: number;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  relatedItems?: string[];
}

interface FoodDetailPageProps {
  params: {
    id: string;
  };
}

const FoodDetailPage: React.FC<FoodDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [foodItem, setFoodItem] = useState<MenuItem | null>(null);
  const [relatedFoods, setRelatedFoods] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const itemResponse = await fetch(`/api/menu-items/${params.id}?populate=true`);
        
        if (!itemResponse.ok) {
          throw new Error('Failed to fetch menu item');
        }
        
        const itemData = await itemResponse.json();
        console.log('Menu Item Data:', JSON.stringify(itemData, null, 2));
        setFoodItem(itemData);
        
        if (itemData.relatedItems && itemData.relatedItems.length > 0) {
          const relatedResponse = await fetch(
            `/api/menu-items?ids=${itemData.relatedItems.join(',')}&populate=true`
          );
          
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedFoods(Array.isArray(relatedData) ? relatedData : []);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load menu item. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load menu item',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
        <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        <p className="text-gray-600 mb-6">Please wait while we load the menu item.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button 
          onClick={() => router.push('/menu')} 
          className="bg-pink-600 hover:bg-pink-700"
        >
          Back to Menu
        </Button>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Food item not found</h1>
        <p className="text-gray-600 mb-6">The food item you are looking for does not exist.</p>
        <Button 
          onClick={() => router.push('/menu')}
          className="bg-pink-600 hover:bg-pink-700"
        >
          Back to Menu
        </Button>
      </div>
    );
  }

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const addToCart = (e?: React.MouseEvent<HTMLButtonElement> | boolean) => {
    if (!foodItem) return;
    
    // Handle both direct calls and event handlers
    const isNavigation = typeof e === 'boolean' ? e : false;
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${foodItem.name} has been added to your cart.`,
      duration: 3000,
    });
    
    // In a real app, this would dispatch to a cart state manager
    
    if (isNavigation) {
      router.push('/checkout');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        type="button"
        variant="ghost"
        className="mb-6 flex items-center text-gray-600 hover:text-pink-600"
        onClick={(e) => {
          e.preventDefault();
          console.log('Navigating back to menu');
          router.push('/menu');
        }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Food Image */}
        <div className="lg:w-1/2">
          <div className="relative h-80 lg:h-[500px] w-full rounded-lg overflow-hidden">
            <Image
              src={foodItem.imageUrl?.startsWith('http') ? foodItem.imageUrl : 
                (foodItem.imageUrl ? `/uploads/${foodItem.imageUrl.split('/').pop()}` : '/placeholder-food.jpg')}
              alt={foodItem.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              quality={90}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                // First try the direct filename, then fall back to placeholder
                if (target.src.includes('placeholder-food.jpg')) {
                  // Already tried placeholder, stop to avoid infinite loop
                  return;
                }
                target.src = '/placeholder-food.jpg';
              }}
            />
          </div>
        </div>

        {/* Food Details */}
        <div className="lg:w-1/2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full mb-2">
                {foodItem.category}
              </span>
              <h1 className="text-3xl font-bold">{foodItem.name}</h1>
              <div className="flex items-center mb-4">
                {foodItem.rating && (
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm mr-3">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span>{foodItem.rating}</span>
                  </div>
                )}
                <span className="text-gray-500 text-sm">
                  {foodItem.preparationTime && `${foodItem.preparationTime} min • `}
                  {foodItem.category}
                </span>
              </div>
              <p className="text-gray-700 mb-6">{foodItem.description}</p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Dietary Information</h3>
                <div className="flex flex-wrap gap-2">
                  {foodItem.isVegetarian && (
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      Vegetarian
                    </span>
                  )}
                  {foodItem.isGlutenFree && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      Gluten Free
                    </span>
                  )}
                  {foodItem.isSpicy && (
                    <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                      Spicy
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  {foodItem.price !== undefined ? formatPrice(foodItem.price) : 'Price not available'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <span className="block text-gray-500 text-sm">Calories</span>
                    <span className="font-semibold">{foodItem.calories || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <span className="block text-gray-500 text-sm">Prep Time</span>
                    <span className="font-semibold">
                      {foodItem.preparationTime ? `${foodItem.preparationTime} min` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <span className="block text-gray-500 text-sm">Availability</span>
                    <span className={`font-semibold ${foodItem.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {foodItem.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-pink-600">{formatPrice(foodItem.price)}</span>
                <div className="flex items-center border rounded-md">
                  <button 
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    onClick={() => updateQuantity(quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-1 font-medium">{quantity}</span>
                  <button 
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    onClick={() => updateQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                  onClick={addToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(true);
                  }}
                >
                  Order Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items */}
      {relatedFoods.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            {relatedFoods.length > 0 ? 'You Might Also Like' : 'Check out our other items'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedFoods.length > 0 ? (
              relatedFoods.map((item) => (
                <Link key={item._id} href={`/menu/${item._id}`} className="block">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
                    <div className="relative h-48 w-full">
                      <Image
                        src={item?.imageUrl?.startsWith('http') ? item.imageUrl : 
                          (item?.imageUrl ? `/uploads/${item.imageUrl.split('/').pop()}` : '/placeholder-food.jpg')}
                        alt={item?.name || 'Menu item'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                        quality={75}
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          const target = e.target as HTMLImageElement;
                          // First try the direct filename, then fall back to placeholder
                          if (target.src.includes('placeholder-food.jpg')) {
                            // Already tried placeholder, stop to avoid infinite loop
                            return;
                          }
                          target.src = '/placeholder-food.jpg';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {typeof item.restaurant === 'string'
                          ? item.restaurant
                          : item.restaurant?.name || 'Restaurant'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-pink-600 font-bold">
                          {formatPrice(item.price)}
                        </span>
                        {item?.rating && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm">{item.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500 mb-4">No related items found.</p>
                <Button variant="outline" onClick={() => router.push('/menu')}>
                  Browse Full Menu
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDetailPage;
