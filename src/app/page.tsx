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
      <section className="hero-gradient text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Delicious Food Delivered to Your Campus
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 opacity-90">
                Order your favorite meals from local restaurants and have them delivered right to your doorstep at your school in Ghana.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="w-full sm:w-auto bg-white text-pink-600 hover:bg-gray-100">
                  <Link href="/menu">
                    Order Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10">
                  <Link href="/restaurants">
                    Browse Restaurants
                  </Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4 md:px-0 mt-8 md:mt-0">
              <div className="relative w-full max-w-lg mx-auto h-[250px] sm:h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-200/20 z-10 rounded-2xl"></div>
                <Image 
                  src="/hero.jpeg" 
                  alt="Delicious food from Soucey" 
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={90}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white z-20">
                  <p className="text-sm font-medium">Taste the difference</p>
                  <p className="text-xs opacity-90">Delivered fresh to your campus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Foods Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <FeaturedFoods />
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <HowItWorks />
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <Testimonials />
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Ready to Order?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
            Download our app or order online to get your favorite food delivered to your campus doorstep.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto bg-white text-pink-600 hover:bg-gray-100">
            <Link href="/menu">
              Order Now
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
