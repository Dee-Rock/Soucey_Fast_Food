"use client"

import { useState } from 'react'
import { ArrowLeft, Upload, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewRestaurantPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    cuisineType: '',
    openingTime: '',
    closingTime: '',
    deliveryFee: '',
    minOrderAmount: '',
    isActive: true,
    featuredRestaurant: false,
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData)
    // Redirect to restaurants list after successful submission
    // router.push('/admin/restaurants')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/restaurants" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold">Add New Restaurant</h1>
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
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. Ghana Kitchen"
                  />
                </div>
                
                <div>
                  <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 mb-1">
                    Cuisine Type *
                  </label>
                  <select
                    id="cuisineType"
                    name="cuisineType"
                    required
                    value={formData.cuisineType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Cuisine Type</option>
                    <option value="Ghanaian">Ghanaian</option>
                    <option value="Nigerian">Nigerian</option>
                    <option value="Italian">Italian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Other">Other</option>
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
                  placeholder="Describe the restaurant, specialties, etc."
                />
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-lg font-medium border-b pb-2">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Full address"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. +233 50 123 4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="restaurant@example.com"
                  />
                </div>
              </div>
            </div>
            
            {/* Business Details */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-lg font-medium border-b pb-2">Business Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="openingTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Opening Time *
                  </label>
                  <input
                    type="time"
                    id="openingTime"
                    name="openingTime"
                    required
                    value={formData.openingTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="closingTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Closing Time *
                  </label>
                  <input
                    type="time"
                    id="closingTime"
                    name="closingTime"
                    required
                    value={formData.closingTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Fee (GHS) *
                  </label>
                  <input
                    type="number"
                    id="deliveryFee"
                    name="deliveryFee"
                    required
                    min="0"
                    step="0.01"
                    value={formData.deliveryFee}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 10.00"
                  />
                </div>
                
                <div>
                  <label htmlFor="minOrderAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Amount (GHS) *
                  </label>
                  <input
                    type="number"
                    id="minOrderAmount"
                    name="minOrderAmount"
                    required
                    min="0"
                    step="0.01"
                    value={formData.minOrderAmount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 20.00"
                  />
                </div>
              </div>
            </div>
            
            {/* Images */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-lg font-medium border-b pb-2">Restaurant Images</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Logo *
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                        Upload Logo
                      </label>
                      <input
                        id="logo-upload"
                        name="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="sr-only"
                      />
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image *
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-24 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                      {coverPreview ? (
                        <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <label htmlFor="cover-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                        Upload Cover
                      </label>
                      <input
                        id="cover-upload"
                        name="cover"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="sr-only"
                      />
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    </div>
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
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active (Restaurant will be visible to customers)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="featuredRestaurant"
                    name="featuredRestaurant"
                    type="checkbox"
                    checked={formData.featuredRestaurant}
                    onChange={handleChange}
                    className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                  <label htmlFor="featuredRestaurant" className="ml-2 block text-sm text-gray-700">
                    Featured Restaurant (Will be highlighted on the homepage)
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-8">
            <Link
              href="/admin/restaurants"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
