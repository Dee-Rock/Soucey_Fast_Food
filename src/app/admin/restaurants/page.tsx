"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash, 
  Star,
  ChevronDown,
  ChevronUp,
  Store,
  Download,
  FileText,
  Loader2
} from 'lucide-react'
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data'
import { getCollection, deleteDocument, updateDocument, Restaurant } from '@/lib/firestore'
export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cuisineFilter, setCuisineFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  
  // Load restaurants from Firestore
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true)
        const data = await getCollection<Restaurant>('restaurants')
        setRestaurants(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching restaurants:', err)
        setError('Failed to load restaurants. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchRestaurants()
  }, [])

  // Get unique cuisine types for filter
  const uniqueCuisines = new Set(restaurants.map(r => r.cuisineType || ''))
  const cuisineTypes = ['all', ...Array.from(uniqueCuisines)]

  // Handle restaurant deletion
  const handleDelete = async (id: string | undefined) => {
    if (!id) return
    
    if (confirm('Are you sure you want to delete this restaurant?')) {
      try {
        const success = await deleteDocument('restaurants', id)
        if (success) {
          setRestaurants(restaurants.filter(restaurant => restaurant.id !== id))
        } else {
          alert('Failed to delete restaurant. Please try again.')
        }
      } catch (err) {
        console.error('Error deleting restaurant:', err)
        alert('An error occurred while deleting the restaurant.')
      }
    }
  }

  // Handle restaurant status toggle
  const handleStatusToggle = async (restaurant: Restaurant) => {
    if (!restaurant.id) return
    
    try {
      const newStatus = restaurant.status === 'active' ? 'inactive' : 'active'
      const success = await updateDocument('restaurants', restaurant.id, { status: newStatus })
      
      if (success) {
        setRestaurants(restaurants.map(r => 
          r.id === restaurant.id ? {...r, status: newStatus} : r
        ))
      } else {
        alert('Failed to update restaurant status. Please try again.')
      }
    } catch (err) {
      console.error('Error updating restaurant status:', err)
      alert('An error occurred while updating the restaurant status.')
    }
  }

  // Filter restaurants based on search term and filters
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || restaurant.status === statusFilter
    const matchesCuisine = cuisineFilter === 'all' || restaurant.cuisineType === cuisineFilter
    
    return matchesSearch && matchesStatus && matchesCuisine
  })

  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    } else if (sortField === 'rating') {
      return sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating
    } else if (sortField === 'orders') {
      return sortDirection === 'asc' ? a.totalOrders - b.totalOrders : b.totalOrders - a.totalOrders
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
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <div className="flex space-x-2">
          <Link 
            href="/admin/restaurants/new" 
            className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Restaurant
          </Link>
          <button 
            onClick={() => exportToCSV(restaurants, `soucey-restaurants-${getFormattedDate()}.csv`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => exportToJSON(restaurants, `soucey-restaurants-${getFormattedDate()}.json`)}
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
              <p className="text-sm font-medium text-gray-500">Total Restaurants</p>
              <p className="text-2xl font-semibold mt-1">{restaurants.length}</p>
            </div>
            <div className="bg-pink-50 p-3 rounded-full">
              <Store className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Restaurants</p>
              <p className="text-2xl font-semibold mt-1">
                {restaurants.filter(r => r.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <Store className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Featured Restaurants</p>
              <p className="text-2xl font-semibold mt-1">
                {restaurants.filter(r => r.featured).length}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
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
              placeholder="Search restaurants by name, address or cuisine..."
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none"
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
              >
                {cuisineTypes.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine === 'all' ? 'All Cuisines' : cuisine}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
          <Loader2 className="h-8 w-8 text-pink-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading restaurants...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-red-700 underline mt-2"
          >
            Try again
          </button>
        </div>
      )}

      {/* Restaurants Table */}
      {!isLoading && !error && restaurants.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No restaurants found</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first restaurant.</p>
          <Link 
            href="/admin/restaurants/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Restaurant
          </Link>
        </div>
      )}

      {!isLoading && !error && restaurants.length > 0 && (
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
                    Restaurant
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cuisine
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('rating')}
                  >
                    Rating
                    {sortField === 'rating' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('orders')}
                  >
                    Orders
                    {sortField === 'orders' && (
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
              {sortedRestaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
                        {/* In a real app, you would display the restaurant logo here */}
                        <div className="h-full w-full flex items-center justify-center bg-pink-100 text-pink-600">
                          <Store className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {restaurant.name}
                          {restaurant.featured && (
                            <Star className="h-4 w-4 text-yellow-500 ml-1" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{restaurant.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{restaurant.phone}</div>
                    <div className="text-xs">{restaurant.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{restaurant.cuisineType}</div>
                    <div className="text-xs">{restaurant.deliveryTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{restaurant.rating}</div>
                      <Star className="h-4 w-4 text-yellow-500 ml-1" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {restaurant.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${restaurant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {restaurant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/admin/restaurants/${restaurant.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(restaurant.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
