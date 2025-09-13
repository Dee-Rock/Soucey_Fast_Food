"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define restaurant interface
export interface RestaurantInfo {
  id: string | number;
  name: string;
  deliveryFee: number;
}

// Define cart item interface
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  restaurant: RestaurantInfo;
  image?: string;
  notes?: string;
  restaurantId: string | number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string | number) => void;
  updateQuantity: (itemId: string | number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  deliveryFee: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setIsInitialized(true);
      }
    };
    
    loadCart();
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  
  // Get the delivery fee from the first restaurant in cart (assuming all items are from the same restaurant)
  const deliveryFee = cartItems.length > 0 && cartItems[0].restaurant ? 
    Number(cartItems[0].restaurant.deliveryFee) || 0 : 0;
  
  const total = (Number(subtotal) || 0) + (Number(deliveryFee) || 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Add item to cart
  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Ensure item has required restaurant data
      if (!item.restaurant) {
        console.error('Cannot add item to cart: Missing restaurant information');
        return prevItems;
      }
      
      // If cart is not empty and the new item is from a different restaurant
      if (prevItems.length > 0 && prevItems[0].restaurantId !== item.restaurantId) {
        // Ask for confirmation to clear the cart
        if (window.confirm('You have items from another restaurant in your cart. Adding this item will clear your cart. Continue?')) {
          return [{ 
            ...item, 
            quantity: 1,
            restaurant: {
              id: item.restaurant.id,
              name: item.restaurant.name,
              deliveryFee: Number(item.restaurant.deliveryFee) || 0
            }
          }];
        }
        return prevItems;
      }
      
      // Check if item already exists in cart
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { 
                ...cartItem, 
                quantity: cartItem.quantity + 1,
                // Ensure restaurant info is preserved
                restaurant: {
                  id: item.restaurant.id,
                  name: item.restaurant.name,
                  deliveryFee: Number(item.restaurant.deliveryFee) || 0
                }
              }
            : cartItem
        );
      }
      
      // Add new item to cart with proper restaurant info
      return [...prevItems, { 
        ...item, 
        quantity: 1,
        restaurant: {
          id: item.restaurant.id,
          name: item.restaurant.name,
          deliveryFee: Number(item.restaurant.deliveryFee) || 0
        }
      }];
    });
  };
  
  // Remove item from cart
  const removeFromCart = (itemId: string | number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  // Update item quantity
  const updateQuantity = (itemId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      total,
      deliveryFee,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
