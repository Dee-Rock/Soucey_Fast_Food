"use client"

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash, 
  UtensilsCrossed,
  ChevronDown,
  ChevronUp,
  Store,
  Download,
  FileText
} from 'lucide-react'
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data'

// Mock data for menu items
const menuItems = [
  {
    id: 1,
    name: 'Jollof Rice with Chicken',
    image: '/images/menu/jollof-rice.jpg',
    description: 'Spicy rice cooked in tomato sauce, served with grilled chicken',
    price: 35.99,
    category: 'Main Dish',
    restaurant: 'Ghana Kitchen',
    restaurantId: 1,
    available: true,
    popular: true,
    preparationTime: '20 min',
    calories: 650
  },
  {
    id: 2,
    name: 'Banku with Tilapia',
    image: '/images/menu/banku-tilapia.jpg',
    description: 'Fermented corn dough served with grilled tilapia and pepper sauce',
    price: 60.00,
    category: 'Main Dish',
    restaurant: 'Accra Delights',
    restaurantId: 3,
    available: true,
    popular: true,
    preparationTime: '25 min',
    calories: 720
  },
  {
    id: 3,
    name: 'Pizza Supreme',
    image: '/images/menu/pizza-supreme.jpg',
    description: 'Pizza topped with pepperoni, sausage, bell peppers, onions, and olives',
    price: 55.99,
    category: 'Pizza',
    restaurant: 'Pizza Corner',
    restaurantId: 2,
    available: true,
    popular: true,
    preparationTime: '15 min',
    calories: 850
  },
  {
    id: 4,
    name: 'Waakye with Fish',
    image: '/images/menu/waakye.jpg',
    description: 'Rice and beans served with fish, spaghetti, and gari',
    price: 35.00,
    category: 'Main Dish',
    restaurant: 'Ghana Kitchen',
    restaurantId: 1,
    available: true,
    popular: false,
    preparationTime: '15 min',
    calories: 580
  },
  {
    id: 5,
    name: 'Kelewele',
    image: '/images/menu/kelewele.jpg',
    description: 'Spicy fried plantains seasoned with ginger and other spices',
    price: 18.99,
    category: 'Appetizer',
    restaurant: 'Accra Delights',
    restaurantId: 3,
    available: true,
    popular: true,
    preparationTime: '10 min',
    calories: 320
  },
  {
    id: 6,
    name: 'Chicken Burger',
    image: '/images/menu/chicken-burger.jpg',
    description: 'Grilled chicken breast with lettuce, tomato, and special sauce',
    price: 45.00,
    category: 'Burger',
    restaurant: 'Burger Hub',
    restaurantId: 5,
    available: false,
    popular: false,
    preparationTime: '12 min',
    calories: 580
  },
  {
    id: 7,
    name: 'Fufu with Light Soup',
    image: '/images/menu/fufu-light-soup.jpg',
    description: 'Pounded cassava and plantain served with light soup and meat',
    price: 65.00,
    category: 'Main Dish',
    restaurant: 'Ghana Kitchen',
    restaurantId: 1,
    available: true,
    popular: true,
    preparationTime: '30 min',
    calories: 720
  },
  {
    id: 8,
    name: 'Fried Rice',
    image: '/images/menu/fried-rice.jpg',
    description: 'Stir-fried rice with vegetables, chicken, and shrimp',
    price: 45.00,
    category: 'Main Dish',
    restaurant: 'Taste of China',
    restaurantId: 6,
    available: true,
    popular: false,
    preparationTime: '15 min',
    calories: 650
  }
]

export default function MenuItemsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [restaurantFilter, setRestaurantFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  // Get unique categories and restaurants for filters
  const uniqueCategories = new Set(menuItems.map(item => item.category))
  const uniqueRestaurants = new Set(menuItems.map(item => item.restaurant))
  const categories = ['all', ...Array.from(uniqueCategories)]
  const restaurants = ['all', ...Array.from(uniqueRestaurants)]

  // Filter menu items based on search term and filters
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesRestaurant = restaurantFilter === 'all' || item.restaurant === restaurantFilter
    const matchesAvailability = availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && item.available) || 
      (availabilityFilter === 'unavailable' && !item.available)
    
    return matchesSearch && matchesCategory && matchesRestaurant && matchesAvailability
  })

  // Sort menu items
  const sortedMenuItems = [...filteredMenuItems].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    } else if (sortField === 'price') {
      return sortDirection === 'asc' ? a.price - b.price : b.price - a.price
    } else if (sortField === 'restaurant') {
      return sortDirection === 'asc' 
        ? a.restaurant.localeCompare(b.restaurant)
        : b.restaurant.localeCompare(a.restaurant)
    } else {
      // Default sort by name
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <div className="flex space-x-2">
          <Link 
            href="/admin/menu-items/new" 
            className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Menu Item
          </Link>
          <button 
            onClick={() => exportToCSV(menuItems, `soucey-menu-items-${getFormattedDate()}.csv`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => exportToJSON(menuItems, `soucey-menu-items-${getFormattedDate()}.json`)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Menu Items</p>
              <p className="text-2xl font-semibold mt-1">{menuItems.length}</p>
            </div>
            <div className="bg-pink-50 p-3 rounded-full">
              <UtensilsCrossed className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Available Items</p>
              <p className="text-2xl font-semibold mt-1">
                {menuItems.filter(item => item.available).length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <UtensilsCrossed className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Popular Items</p>
              <p className="text-2xl font-semibold mt-1">
                {menuItems.filter(item => item.popular).length}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <UtensilsCrossed className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search menu items by name, description, category or restaurant..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none"
                value={restaurantFilter}
                onChange={(e) => setRestaurantFilter(e.target.value)}
              >
                {restaurants.map((restaurant) => (
                  <option key={restaurant} value={restaurant}>
                    {restaurant === 'all' ? 'All Restaurants' : restaurant}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="all">All Availability</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('name')}
                  >
                    Item
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('price')}
                  >
                    Price
                    {sortField === 'price' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('restaurant')}
                  >
                    Restaurant
                    {sortField === 'restaurant' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedMenuItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded overflow-hidden">
                        {/* In a real app, you would display the item image here */}
                        <div className="h-full w-full flex items-center justify-center bg-pink-100 text-pink-600">
                          <UtensilsCrossed className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {item.name}
                          {item.popular && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    GHS {item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-500">
                        <Store className="h-3 w-3" />
                      </div>
                      <div className="ml-2 text-sm text-gray-500">{item.restaurant}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/admin/menu-items/${item.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
