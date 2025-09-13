"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { useCart, CartItem } from '@/context/cart-context';
import { useToast } from '@/components/ui/use-toast';

interface AddToCartButtonProps {
  item: {
    id: string | number;
    name: string;
    price: number;
    restaurant: {
      id: string | number;
      name: string;
      deliveryFee: number;
    };
    image?: string;
  };
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function AddToCartButton({ 
  item, 
  variant = 'default',
  size = 'default'
}: AddToCartButtonProps) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  
  // Check if item is already in cart
  const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
  const quantity = existingItem ? existingItem.quantity : 0;
  
  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurant: {
        id: item.restaurant.id,
        name: item.restaurant.name,
        deliveryFee: item.restaurant.deliveryFee
      },
      restaurantId: item.restaurant.id,
      image: item.image
    };
    
    addToCart(cartItem);
    
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1500);
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 3000,
    });
  };
  
  const incrementQuantity = () => {
    updateQuantity(item.id, quantity + 1);
  };
  
  const decrementQuantity = () => {
    updateQuantity(item.id, quantity - 1);
  };
  
  if (quantity > 0) {
    return (
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={decrementQuantity}
          className="h-8 w-8"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-medium">{quantity}</span>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={incrementQuantity}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={isAdding}
      className="transition-all duration-200"
    >
      {isAdding ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
