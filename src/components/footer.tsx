"use client"

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-pink-400">Soucey</h3>
            <p className="text-gray-300 mb-4">
              Your favorite food delivery service for campus life in HO. Order delicious meals from our restaurants and have them delivered right to your location.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-pink-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-pink-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-pink-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-pink-400 mr-2 mt-1" />
                <span className="text-gray-300">Campus Area, Ho, Ghana</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-pink-400 mr-2" />
                <span className="text-gray-300">+233 54 570 4442</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-pink-400 mr-2" />
                <span className="text-gray-300">noraagbenorto5@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-pink-400">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Monday - Friday: 5:00 PM - 12:00 AM</li>
              <li className="text-gray-300">Saturday: 2:00 PM - 12:00 AM</li>
              <li className="text-gray-300">Sunday: 2:00 PM - 12:00 AM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Soucey. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/terms" className="text-gray-400 text-sm hover:text-pink-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 text-sm hover:text-pink-400 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
