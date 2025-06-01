"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, Clock, Store } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// Sample food data (in a real app, this would come from a database)
const foodItems = [
  {
    id: 1,
    name: 'Jollof Rice with Chicken',
    description: 'Spicy Ghanaian jollof rice served with grilled chicken and vegetables. Our jollof rice is cooked with the finest ingredients, including fresh tomatoes, onions, peppers, and a blend of traditional spices. The chicken is marinated and grilled to perfection, resulting in a juicy and flavorful dish that represents the best of Ghanaian cuisine.',
    price: 35.99,
    image: '/jollof-rice.jpg',
    category: 'Local Dishes',
    restaurant: 'Ghana Kitchen',
    rating: 4.8,
    preparationTime: 25,
    ingredients: ['Rice', 'Chicken', 'Tomatoes', 'Onions', 'Peppers', 'Spices', 'Vegetable Oil'],
    nutritionalInfo: {
      calories: 650,
      protein: '35g',
      carbs: '80g',
      fat: '18g',
    },
    relatedItems: [3, 6, 11],
  },
  {
    id: 2,
    name: 'Banku with Tilapia',
    description: 'Traditional Ghanaian banku served with grilled tilapia and hot pepper sauce. Banku is a fermented corn and cassava dough that is cooked until it reaches a smooth, stretchy consistency. It is served with perfectly grilled tilapia fish and our signature hot pepper sauce, creating a delicious combination of flavors that is popular throughout Ghana.',
    price: 45.99,
    image: '/banku-tilapia.jpg',
    category: 'Local Dishes',
    restaurant: 'Accra Delights',
    rating: 4.7,
    preparationTime: 30,
    ingredients: ['Corn Dough', 'Cassava Dough', 'Tilapia', 'Peppers', 'Onions', 'Tomatoes', 'Spices'],
    nutritionalInfo: {
      calories: 720,
      protein: '42g',
      carbs: '65g',
      fat: '22g',
    },
    relatedItems: [7, 11, 12],
  },
  {
    id: 3,
    name: 'Waakye Special',
    description: 'Rice and beans dish served with spaghetti, meat, fish, and gari. Waakye is a beloved Ghanaian dish made from rice and beans cooked together with dried millet leaves, which give it its distinctive color. Our Waakye Special comes with a variety of accompaniments including spaghetti, boiled egg, meat, fish, and gari, making it a complete and satisfying meal.',
    price: 40.99,
    image: '/waakye.jpg',
    category: 'Local Dishes',
    restaurant: 'Street Food Hub',
    rating: 4.6,
    preparationTime: 20,
    ingredients: ['Rice', 'Beans', 'Spaghetti', 'Meat', 'Fish', 'Gari', 'Waakye Leaves'],
    nutritionalInfo: {
      calories: 850,
      protein: '38g',
      carbs: '110g',
      fat: '25g',
    },
    relatedItems: [1, 6, 11],
  },
  {
    id: 4,
    name: 'Chicken Burger',
    description: 'Juicy chicken burger with lettuce, tomato, cheese, and special sauce. Our chicken burger features a tender, seasoned chicken breast that is grilled to perfection. It is served on a soft brioche bun with fresh lettuce, ripe tomatoes, melted cheese, and our signature special sauce that adds a delicious tangy flavor to every bite.',
    price: 30.99,
    image: '/chicken-burger.jpg',
    category: 'Fast Food',
    restaurant: 'Burger Palace',
    rating: 4.5,
    preparationTime: 15,
    ingredients: ['Chicken Breast', 'Brioche Bun', 'Lettuce', 'Tomato', 'Cheese', 'Special Sauce'],
    nutritionalInfo: {
      calories: 580,
      protein: '32g',
      carbs: '45g',
      fat: '28g',
    },
    relatedItems: [5, 8, 10],
  },
  {
    id: 5,
    name: 'Pizza Supreme',
    description: 'Delicious pizza topped with pepperoni, sausage, bell peppers, and cheese. Our Pizza Supreme is made with a hand-tossed crust that is both crispy and chewy. It is topped with a rich tomato sauce, mozzarella cheese, pepperoni, Italian sausage, bell peppers, onions, and black olives, creating a flavor-packed pizza that is sure to satisfy.',
    price: 55.99,
    image: '/pizza.jpg',
    category: 'Fast Food',
    restaurant: 'Pizza Corner',
    rating: 4.9,
    preparationTime: 25,
    ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella Cheese', 'Pepperoni', 'Sausage', 'Bell Peppers', 'Onions', 'Black Olives'],
    nutritionalInfo: {
      calories: 920,
      protein: '40g',
      carbs: '85g',
      fat: '48g',
    },
    relatedItems: [4, 8, 10],
  },
  // More food items...
];

interface FoodDetailPageProps {
  params: {
    id: string;
  };
}

const FoodDetailPage: React.FC<FoodDetailPageProps> = ({ params }) => {
  const foodId = parseInt(params.id);
  const food = foodItems.find(item => item.id === foodId);
  
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  if (!food) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Food item not found</h1>
        <p className="text-gray-600 mb-6">The food item you are looking for does not exist.</p>
        <Button asChild className="bg-pink-600 hover:bg-pink-700">
          <Link href="/menu">
            Back to Menu
          </Link>
        </Button>
      </div>
    );
  }

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} x ${food.name} has been added to your cart.`,
      duration: 3000,
    });
    // In a real app, this would dispatch to a cart state manager
  };

  // Find related food items
  const relatedFoods = food.relatedItems
    ? food.relatedItems.map(id => foodItems.find(item => item.id === id)).filter(Boolean)
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        asChild
        variant="ghost"
        className="mb-6 flex items-center text-gray-600 hover:text-pink-600"
      >
        <Link href="/menu">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
        </Link>
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Food Image */}
        <div className="lg:w-1/2">
          <div className="relative h-80 lg:h-[500px] w-full rounded-lg overflow-hidden">
            <Image
              src={food.image || '/images/placeholder-food.jpg'}
              alt={food.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              quality={90}
              onError={(e: any) => {
                e.target.src = '/images/placeholder-food.jpg';
              }}
            />
          </div>
        </div>

        {/* Food Details */}
        <div className="lg:w-1/2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full mb-2">
                {food.category}
              </span>
              <h1 className="text-3xl font-bold">{food.name}</h1>
              <div className="flex items-center mt-2">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-medium mr-4">{food.rating}</span>
                <Clock className="w-5 h-5 text-gray-400 mr-1" />
                <span className="text-gray-600 mr-4">{food.preparationTime} mins</span>
                <Store className="w-5 h-5 text-gray-400 mr-1" />
                <span className="text-gray-600">{food.restaurant}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{food.description}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {food.ingredients.map((ingredient, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Nutritional Information</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <span className="block text-gray-500 text-sm">Calories</span>
                  <span className="font-semibold">{food.nutritionalInfo.calories}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <span className="block text-gray-500 text-sm">Protein</span>
                  <span className="font-semibold">{food.nutritionalInfo.protein}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <span className="block text-gray-500 text-sm">Carbs</span>
                  <span className="font-semibold">{food.nutritionalInfo.carbs}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <span className="block text-gray-500 text-sm">Fat</span>
                  <span className="font-semibold">{food.nutritionalInfo.fat}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-bold text-pink-600">{formatPrice(food.price)}</span>
              <div className="flex items-center border rounded-md">
                <button 
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  onClick={() => updateQuantity(quantity - 1)}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1 font-medium">{quantity}</span>
                <button 
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  onClick={() => updateQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-pink-600 hover:bg-pink-700"
                onClick={addToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/checkout">
                  Order Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items */}
      {relatedFoods.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedFoods.map((item) => (
              <Link key={item?.id} href={`/menu/${item?.id}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-48 w-full">
                    <Image
                      src={item?.image || '/images/placeholder-food.jpg'}
                      alt={item?.name || ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                      quality={75}
                      onError={(e: any) => {
                        e.target.src = '/images/placeholder-food.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{item?.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{item?.restaurant}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-600 font-bold">{formatPrice(item?.price || 0)}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm">{item?.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDetailPage;
