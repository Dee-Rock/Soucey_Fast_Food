"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton, useUser } from '@clerk/nextjs';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { isSignedIn } = useUser();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isHomePage = pathname === '/';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-28 sm:w-36 h-8 sm:h-10">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-pink-600 rounded blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="relative w-full h-full flex items-center">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <Image 
                    src="/Soucey.jpeg" 
                    alt="Soucey Logo" 
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 640px) 112px, 144px"
                  />
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isHomePage && (
            <div className="hidden md:flex items-center space-x-6">
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
            </div>
          )}

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-pink-600 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
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
          <div className="md:hidden flex items-center space-x-3">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button 
              onClick={toggleMenu} 
              className="p-2 text-gray-700 hover:text-pink-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-6">
              <Link href="/" className="text-lg font-medium text-gray-900 hover:text-pink-600 transition-colors">
                Home
              </Link>
              <Link href="/menu" className="text-lg font-medium text-gray-900 hover:text-pink-600 transition-colors">
                Menu
              </Link>
              <Link href="/restaurants" className="text-lg font-medium text-gray-900 hover:text-pink-600 transition-colors">
                Restaurants
              </Link>
              <Link href="/about" className="text-lg font-medium text-gray-900 hover:text-pink-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-lg font-medium text-gray-900 hover:text-pink-600 transition-colors">
                Contact
              </Link>
              
              {isSignedIn ? (
                <div className="py-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-4">
                  <Button asChild variant="outline" size="lg" className="w-full border-pink-500 text-pink-600 hover:bg-pink-50">
                    <Link href="/sign-in">
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild size="lg" className="w-full bg-pink-600 hover:bg-pink-700">
                    <Link href="/sign-up">
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
