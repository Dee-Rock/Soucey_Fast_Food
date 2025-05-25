import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import FeaturedFoods from '@/components/featured-foods';
import HowItWorks from '@/components/how-it-works';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-28">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Delicious Food Delivered to Your Campus
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Order your favorite meals from local restaurants and have them delivered right to your doorstep at your school in Ghana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                <Link href="/menu">
                  Order Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                <Link href="/restaurants">
                  Browse Restaurants
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-[350px] rounded-xl overflow-hidden shadow-2xl">
              <Image 
                src="/hero-food.jpg" 
                alt="Delicious food" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Foods Section */}
      <FeaturedFoods />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <section className="bg-pink-50 section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-pink-700 font-bold">S{i}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Student {i}</h4>
                    <p className="text-sm text-gray-500">Campus Resident</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "The food delivery service is amazing! I can order delicious meals right to my dorm. The app is easy to use and the delivery is always on time."
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Download our app or order online to get your favorite food delivered to your campus doorstep.
          </p>
          <Button asChild size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
            <Link href="/menu">
              Order Now
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
