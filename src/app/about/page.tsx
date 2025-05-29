import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">About Soucey</h1>
      <p className="text-gray-600 mb-8">Learn more about our food delivery service</p>
      
      {/* Hero Section */}
      <div className="bg-pink-50 rounded-lg p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Bringing Delicious Food to Your Campus</h2>
            <p className="text-gray-700 mb-4">
              Soucey is a food ordering and delivery platform designed specifically for students in Ghana. 
              We connect hungry students with the best local and international restaurants, bringing delicious 
              meals right to your doorstep on campus.
            </p>
            <p className="text-gray-700 mb-6">
              Our mission is to make food ordering convenient, affordable, and enjoyable for every student, 
              while supporting local restaurants and food vendors.
            </p>
            <Button asChild className="bg-pink-600 hover:bg-pink-700">
              <Link href="/restaurants">
                Explore Restaurants
              </Link>
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <Image 
                src="/Soucey.jpeg" 
                alt="About Soucey" 
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Story */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Story</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-700 mb-4">
            Soucey was founded in 2025 by a group of university students who were frustrated with the limited 
            food options available on campus. They wanted to create a platform that would make it easy for 
            students to order food from a variety of restaurants and have it delivered quickly to their 
            dorms or campus locations.
          </p>
          <p className="text-gray-700 mb-4">
            What started as a small project serving a single campus has now grown into a popular food 
            delivery service across multiple universities in Ghana. We're proud to connect students with 
            delicious food options while also supporting local restaurants and creating job opportunities 
            for delivery drivers.
          </p>
          <p className="text-gray-700">
            Our team is committed to continuously improving the Soucey experience, adding new restaurants, 
            and expanding to more campuses to serve even more hungry students.
          </p>
        </div>
      </div>
      
      {/* Our Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Quality</h3>
            <p className="text-gray-700 text-center">
              We partner with the best restaurants that maintain high standards of food quality and hygiene.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Speed</h3>
            <p className="text-gray-700 text-center">
              We understand that students are busy, so we strive to deliver your food as quickly as possible.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Community</h3>
            <p className="text-gray-700 text-center">
              We're committed to supporting local businesses and creating opportunities within the campus community.
            </p>
          </div>
        </div>
      </div>
      
      {/* Team */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1">Team Member {i}</h3>
              <p className="text-pink-600 mb-3">Co-Founder</p>
              <p className="text-gray-700 text-sm">
                Passionate about food and technology, helping to connect students with great meals.
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA */}
      <div className="bg-pink-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Order?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Explore our wide selection of restaurants and food options, and get your favorite meals delivered to your campus.
        </p>
        <Button asChild variant="outline" size="lg" className="bg-white text-pink-600 hover:bg-gray-100 border-white">
          <Link href="/menu">
            Browse Menu
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AboutPage;
