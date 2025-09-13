"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/context/cart-context';

// Cart items now come from the cart context

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, total, deliveryFee } = useCart();
  const { toast } = useToast();

  const handleRemoveItem = (id: string | number) => {
    removeFromCart(id);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
      duration: 3000,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Cart</h1>
      <p className="text-gray-600 mb-8">Review your items before checkout</p>
      
      {cartItems.length > 0 && cartItems[0]?.restaurant && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium">
            Ordering from: <span className="font-semibold">{cartItems[0].restaurant.name}</span>
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Delivery fee: {formatPrice(deliveryFee)}
          </p>
        </div>
      )}
      
      {cartItems.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden mr-4 mb-4 sm:mb-0">
                      <Image
                        src={item.image || '/placeholder-food.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow mb-4 sm:mb-0">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.restaurant.name}</p>
                      <p className="text-pink-600 font-medium">{formatPrice(item.price)}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex items-center border rounded-md mr-4">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4 text-gray-500" />
                        </button>
                        <span className="mx-2 font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 rounded-md hover:bg-gray-100 text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="border-t pt-3 mt-3 border-gray-200">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-pink-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              <Button asChild className="w-full bg-pink-600 hover:bg-pink-700">
                <Link href="/checkout" className="flex items-center justify-center">
                  Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Need help? Contact our support team</p>
                <p className="mt-1">
                  <Link href="/contact" className="text-pink-600 hover:underline">
                    Get Support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild className="bg-pink-600 hover:bg-pink-700">
            <Link href="/menu">
              Browse Menu
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
