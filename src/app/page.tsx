import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import FeaturedFoods from '@/components/featured-foods';
import HowItWorks from '@/components/how-it-works';
import Testimonials from '@/components/testimonials';

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
            <div className="relative w-full max-w-md h-[350px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-2 hover:rotate-0 transition-all duration-500 hover:shadow-pink-200 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-200/20 z-10 rounded-3xl"></div>
              <Image 
                src="/hero.jpeg" 
                alt="Delicious food from Soucey" 
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white z-20">
                <p className="text-sm font-medium">Taste the difference</p>
                <p className="text-xs opacity-90">Delivered fresh to your campus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Foods Section */}
      <FeaturedFoods />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <Testimonials />

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
