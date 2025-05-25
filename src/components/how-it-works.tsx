"use client"

import React from 'react';
import { 
  Search, 
  ShoppingCart, 
  Clock, 
  MapPin 
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Browse Menu',
    description: 'Explore our wide variety of delicious meals from local restaurants.',
    icon: <Search className="w-8 h-8 text-pink-600" />,
  },
  {
    id: 2,
    title: 'Place Your Order',
    description: 'Select your favorite dishes and add them to your cart.',
    icon: <ShoppingCart className="w-8 h-8 text-pink-600" />,
  },
  {
    id: 3,
    title: 'Wait for Delivery',
    description: 'Track your order in real-time as it\'s being prepared and delivered.',
    icon: <Clock className="w-8 h-8 text-pink-600" />,
  },
  {
    id: 4,
    title: 'Enjoy Your Meal',
    description: 'Receive your food at your campus location and enjoy!',
    icon: <MapPin className="w-8 h-8 text-pink-600" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Ordering food with Soucey is quick and easy. Follow these simple steps to get delicious meals delivered to your campus.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto bg-pink-100 rounded-full flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <div className="absolute -mt-12 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {step.id}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
