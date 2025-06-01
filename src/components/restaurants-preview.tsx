"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function RestaurantsPreview() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partner Restaurants</h1>
          <p className="text-lg md:text-xl mb-8">Discover amazing restaurants near you</p>
        </div>
      </div>

      {/* Preview Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Sign In to View All Restaurants</h2>
          <p className="text-gray-600 mb-8">Create an account or sign in to explore restaurants, view menus, and place orders!</p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => router.push("/sign-in")}
              className="bg-primary hover:bg-primary/90"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => router.push("/sign-up")}
              variant="outline"
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Blurred Preview Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="relative bg-white rounded-lg shadow-md overflow-hidden filter blur-[2px]">
              <div className="relative h-48 w-full bg-gray-200" />
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3].map((tag) => (
                    <div key={tag} className="h-6 bg-gray-200 rounded w-16" />
                  ))}
                </div>
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 