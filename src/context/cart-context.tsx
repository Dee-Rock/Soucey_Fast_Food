"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define cart item interface
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
  image?: string;
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
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 10.00 : 0;
  const total = subtotal + deliveryFee;
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Add item to cart
  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add it
        return [...prevItems, item];
      }
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
