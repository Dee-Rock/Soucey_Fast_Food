"use client"

import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  campus: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/testimonials');
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        setTestimonials(data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Fallback testimonials if none are available from Firestore
  const fallbackTestimonials = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Campus Resident',
      comment: 'The food delivery service is amazing! I can order delicious meals right to my dorm. The app is easy to use and the delivery is always on time.',
      rating: 5,
      campus: 'University of Ghana'
    },
    {
      id: '2',
      name: 'Sarah Smith',
      role: 'Student',
      comment: 'Soucey has been a lifesaver during exam weeks. Quick delivery and great food options from local restaurants.',
      rating: 5,
      campus: 'KNUST'
    },
    {
      id: '3',
      name: 'Michael Brown',
      role: 'Graduate Student',
      comment: 'I love the variety of food options available. The prices are reasonable and the delivery is always prompt.',
      rating: 4,
      campus: 'University of Cape Coast'
    }
  ];

  // Use fallback testimonials if there's an error or no testimonials from Firestore
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  if (isLoading) {
    return (
      <section className="bg-pink-50 section-padding">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-12 h-12 text-pink-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-pink-50 section-padding">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-pink-700 font-bold">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700">
                "{testimonial.comment}"
              </p>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              {testimonial.campus && (
                <p className="mt-2 text-xs text-gray-500">{testimonial.campus}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
