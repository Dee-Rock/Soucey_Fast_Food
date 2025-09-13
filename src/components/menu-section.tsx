"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, Utensils } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/context/cart-context';

// Custom Card Components
const Card = ({ className = '', children, ...props }: { className?: string, children: React.ReactNode }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`font-bold text-lg ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
);

// Skeleton Loader
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

// Custom Scroll Area
const ScrollArea = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`overflow-auto ${className}`}>
    {children}
  </div>
);

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
}

interface MenuSectionProps {
  restaurantId: string;
  restaurantName?: string;
  deliveryFee?: number;
}

export default function MenuSection({ restaurantId, restaurantName = 'Restaurant', deliveryFee = 0 }: MenuSectionProps) {
  const { toast } = useToast();
  const { addToCart: addToCartContext } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching menu items for restaurant:', restaurantId);
        const response = await fetch(`/api/menu-items?restaurantId=${restaurantId}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch menu items:', response.status, errorText);
          throw new Error('Failed to fetch menu items');
        }
        
        const data = await response.json();
        console.log('Raw menu items data:', data);
        
        // Transform the data to match the expected format
        const formattedData = data.map((item: any) => {
          const formattedItem = {
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            // Try both image and imageUrl fields, and ensure the path is correct
            imageUrl: item.image || item.imageUrl,
            category: item.category || 'Uncategorized'
          };
          console.log('Formatted menu item:', formattedItem);
          return formattedItem;
        });
        
        setMenuItems(formattedData);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(formattedData.map((item: MenuItem) => item.category)));
        console.log('Extracted categories:', uniqueCategories);
        setCategories(uniqueCategories as string[]);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId]);

  const filteredItems = category 
    ? menuItems.filter(item => item.category === category)
    : menuItems;

  const groupedItems = filteredItems.reduce((acc: Record<string, MenuItem[]>, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const updateQuantity = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const addToCart = (item: MenuItem) => {
    const quantity = quantities[item._id] || 1;
    if (quantity <= 0) return;
    
    try {
      addToCartContext({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: quantity,
        image: item.imageUrl,
        restaurantId: restaurantId,
        restaurant: {
          id: restaurantId,
          name: restaurantName,
          deliveryFee: deliveryFee
        }
      });
      
      // Reset quantity after adding to cart
      setQuantities(prev => ({
        ...prev,
        [item._id]: 0
      }));
      
      toast({
        title: 'Added to cart',
        description: `${quantity} x ${item.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((j) => (
                <Card key={j} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex space-x-2">
          <Button
            variant={!category ? "default" : "outline"}
            size="sm"
            onClick={() => window.history.pushState({}, '', window.location.pathname)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.set('category', cat);
                window.history.pushState({}, '', `${window.location.pathname}?${params}`);
              }}
            >
              {cat}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Menu Items */}
      <div className="space-y-12">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-6">
            <h2 className="text-2xl font-bold border-b pb-2">{category}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card key={item._id} className="overflow-hidden flex flex-col h-full">
                  <div className="relative h-48 w-full bg-gray-100">
                    {item.imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={process.env.NODE_ENV !== 'production'}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.style.display = 'none';
                            const parent = target.parentElement?.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'absolute inset-0 flex items-center justify-center bg-gray-50';
                              const icon = document.createElement(Utensils as any);
                              icon.className = 'h-12 w-12 text-gray-300';
                              fallback.appendChild(icon);
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <Utensils className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                  </CardHeader>
                  <div className="mt-auto p-6 pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item._id, -1)}
                          disabled={(quantities[item._id] || 0) <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center">
                          {quantities[item._id] || 0}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item._id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => addToCart(item)}
                          disabled={(quantities[item._id] || 0) <= 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
