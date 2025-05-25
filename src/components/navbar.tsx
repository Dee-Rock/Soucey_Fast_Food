"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton, useUser } from '@clerk/nextjs';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 mr-2">
              <Image 
                src="/logo.png" 
                alt="Soucey Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl text-pink-600">Soucey</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors">
              Home
            </Link>
            <Link href="/menu" className="text-gray-700 hover:text-pink-600 transition-colors">
              Menu
            </Link>
            <Link href="/restaurants" className="text-gray-700 hover:text-pink-600 transition-colors">
              Restaurants
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-pink-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-pink-600 transition-colors" />
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
            
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex space-x-2">
                <Button asChild variant="outline" size="sm" className="border-pink-500 text-pink-600 hover:bg-pink-50">
                  <Link href="/sign-in">
                    Sign In
                  </Link>
                </Button>
                <Button asChild size="sm" className="bg-pink-600 hover:bg-pink-700">
                  <Link href="/sign-up">
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
            <button onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors py-2" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/menu" className="text-gray-700 hover:text-pink-600 transition-colors py-2" onClick={toggleMenu}>
              Menu
            </Link>
            <Link href="/restaurants" className="text-gray-700 hover:text-pink-600 transition-colors py-2" onClick={toggleMenu}>
              Restaurants
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-pink-600 transition-colors py-2" onClick={toggleMenu}>
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-600 transition-colors py-2" onClick={toggleMenu}>
              Contact
            </Link>
            
            {isSignedIn ? (
              <div className="py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex flex-col space-y-2 py-2">
                <Button asChild variant="outline" className="border-pink-500 text-pink-600 hover:bg-pink-50 w-full">
                  <Link href="/sign-in">
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="bg-pink-600 hover:bg-pink-700 w-full">
                  <Link href="/sign-up">
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
