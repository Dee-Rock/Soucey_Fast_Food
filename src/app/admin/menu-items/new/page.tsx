"use client"

import { useState, useEffect } from 'react'
import { ArrowLeft, Upload, Save, Loader } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

// Categories for menu items
const categories = [
  'Main Dishes',
  'Sides',
  'Appetizers',
  'Desserts',
  'Beverages',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Specials'
]

export default function NewMenuItemPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restaurants, setRestaurants] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    category: '',
    restaurantId: '',
    preparationTime: '',
    calories: '',
    isVegetarian: false,
    isSpicy: false,
    isGlutenFree: false,
    isAvailable: true,
    isFeatured: false,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/restaurants');
        
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        
        const data = await response.json();
        const restaurantList = data.map((restaurant: any) => ({
          id: restaurant._id,
          name: restaurant.name
        }));
        
        setRestaurants(restaurantList);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        toast({
          title: "Error",
          description: "Failed to load restaurants. Please refresh the page.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.name || !formData.price || !formData.restaurantId || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle image file upload
      let imageUrl = "";
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        
        try {
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload image');
          }
          
          const { url } = await uploadResponse.json();
          imageUrl = url;
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast({
            title: "Upload Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Create menu item document via API
      const menuItemData = {
        ...formData,
        imageUrl: imageUrl || '/images/placeholder-food.jpg',
        price: parseFloat(formData.price),
        isAvailable: true,
        isFeatured: false,
      };

      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create menu item');
      }

      const newMenuItem = await response.json();

      toast({
        title: "Success",
        description: `Menu item ${formData.name} has been created successfully.`,
        duration: 3000,
      });

      // Redirect to menu items list
      router.push('/admin/menu-items');
    } catch (error) {
      console.error('Error creating menu item:', error);
      // Show more detailed error information
      const errorMessage = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : 'Unknown error occurred';
      
      toast({
        title: "Error",
        description: `Failed to create menu item: ${errorMessage}`,
        variant: "destructive",
        duration: 10000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/menu-items" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold">Add New Menu Item</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Basic Information */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-lg font-medium border-b pb-2">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. Jollof Rice with Chicken"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Describe the menu item, ingredients, etc."
                />
              </div>
            </div>
            
            {/* Restaurant & Pricing */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-lg font-medium border-b pb-2">Restaurant & Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant *
                  </label>
                  <select
                    id="restaurantId"
                    name="restaurantId"
                    required
                    value={formData.restaurantId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a restaurant</option>
                    {restaurants.length > 0 ? (
                      restaurants.map((restaurant) => (
                        <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                      ))
                    ) : (
                      <option disabled>Loading restaurants...</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="preparationTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Preparation Time (minutes) *
                  </label>
                  <input
                    type="number"
                    id="preparationTime"
                    name="preparationTime"
                    required
                    min="1"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 15"
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (GHS) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 35.00"
                  />
                </div>
                
                <div>
                  <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Discounted Price (GHS)
                  </label>
                  <input
                    type="number"
                    id="discountedPrice"
                    name="discountedPrice"
                    min="0"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Leave empty if no discount"
                  />
                </div>
              </div>
            </div>
            
            {/* Nutritional Info & Attributes */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-lg font-medium border-b pb-2">Nutritional Info & Attributes</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    min="0"
                    value={formData.calories}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 450"
                  />
                </div>
                
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center">
                    <input
                      id="isVegetarian"
                      name="isVegetarian"
                      type="checkbox"
                      checked={formData.isVegetarian}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isVegetarian" className="ml-2 block text-sm text-gray-700">
                      Vegetarian
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="isSpicy"
                      name="isSpicy"
                      type="checkbox"
                      checked={formData.isSpicy}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isSpicy" className="ml-2 block text-sm text-gray-700">
                      Spicy
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="isGlutenFree"
                      name="isGlutenFree"
                      type="checkbox"
                      checked={formData.isGlutenFree}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isGlutenFree" className="ml-2 block text-sm text-gray-700">
                      Gluten Free
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Image */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-lg font-medium border-b pb-2">Item Image</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menu Item Image *
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Item preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <label htmlFor="image-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                      Upload Image
                    </label>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-lg font-medium border-b pb-2">Status</h2>
              
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <input
                    id="isAvailable"
                    name="isAvailable"
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                    Available (Item will be visible to customers)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                    Featured Item (Will be highlighted on the restaurant page)
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-8">
            <Link
              href="/admin/menu-items"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Menu Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
