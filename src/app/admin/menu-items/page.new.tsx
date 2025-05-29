"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash, 
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Loader
} from 'lucide-react'
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data'
import { connectToDatabase } from '@/lib/mongodb'
import { IMenuItem } from '@/models/MenuItem'
import { formatPrice } from '@/lib/utils'

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const [categories, setCategories] = useState<string[]>([])

  // Load menu items
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true)
        const { db } = await connectToDatabase()
        
        if (!db) {
          throw new Error('Database connection failed')
        }
        
        // Build the query
        const query: any = {}
        
        // Apply category filter if selected
        if (filterCategory) {
          query.category = filterCategory
        }
        
        // Apply search query if provided
        if (searchQuery) {
          query.$or = [
            { name: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } }
          ]
        }
        
        // Build sort object
        const sort: any = { [sortBy]: sortDirection === 'asc' ? 1 : -1 }
        
        // Get unique categories for filter dropdown
        const categories = await db.collection('menuItems').distinct('category')
        setCategories(categories.filter(Boolean))
        
        // Execute query
        const items = await db.collection('menuItems')
          .find(query)
          .sort(sort)
          .limit(10)
          .toArray()
        
        // Format items for display
        const formattedItems = items.map(item => ({
          ...item,
          id: item._id.toString(),
          _id: undefined,
          // Ensure all required fields have default values
          name: item.name || '',
          description: item.description || '',
          price: item.price || 0,
          category: item.category || 'Uncategorized',
          restaurantId: item.restaurantId?.toString() || '',
          imageUrl: item.imageUrl || '/placeholder-food.jpg',
          isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
          isVegetarian: item.isVegetarian || false,
          isSpicy: item.isSpicy || false,
          isGlutenFree: item.isGlutenFree || false,
          isFeatured: item.isFeatured || false,
          createdAt: item.createdAt || new Date(),
          updatedAt: item.updatedAt || new Date()
        })) as IMenuItem[]
        
        setMenuItems(formattedItems)
        setLastVisible(items.length === 10 ? items[items.length - 1]._id : null)
        setHasMore(items.length === 10)
        setError(null)
      } catch (err) {
        console.error('Error loading menu items:', err)
        setError('Failed to load menu items. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadMenuItems()
  }, [filterCategory, searchQuery, sortBy, sortDirection])

  // Load more items
  const loadMoreItems = async () => {
    if (!lastVisible || !hasMore) return
    
    try {
      setIsLoading(true)
      const { db } = await connectToDatabase()
      
      if (!db) {
        throw new Error('Database connection failed')
      }
      
      // Build the query
      const query: any = { _id: { $gt: lastVisible } }
      
      // Apply category filter if selected
      if (filterCategory) {
        query.category = filterCategory
      }
      
      // Apply search query if provided
      if (searchQuery) {
        query.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } }
        ]
      }
      
      // Build sort object
      const sort: any = { [sortBy]: sortDirection === 'asc' ? 1 : -1 }
      
      // Execute query
      const items = await db.collection('menuItems')
        .find(query)
        .sort(sort)
        .limit(10)
        .toArray()
      
      // Format items for display
      const formattedItems = items.map(item => ({
        ...item,
        id: item._id.toString(),
        _id: undefined,
        // Ensure all required fields have default values
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        category: item.category || 'Uncategorized',
        restaurantId: item.restaurantId?.toString() || '',
        imageUrl: item.imageUrl || '/placeholder-food.jpg',
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        isVegetarian: item.isVegetarian || false,
        isSpicy: item.isSpicy || false,
        isGlutenFree: item.isGlutenFree || false,
        isFeatured: item.isFeatured || false,
        createdAt: item.createdAt || new Date(),
        updatedAt: item.updatedAt || new Date()
      })) as IMenuItem[]
      
      setMenuItems(prevItems => [...prevItems, ...formattedItems])
      setLastVisible(items.length === 10 ? items[items.length - 1]._id : null)
      setHasMore(items.length === 10)
    } catch (err) {
      console.error('Error loading more menu items:', err)
      setError('Failed to load more menu items. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Reset pagination when searching
    setLastVisible(null)
  }

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
    // Reset pagination when sorting
    setLastVisible(null)
  }

  // Handle filter
  const handleFilterChange = (category: string) => {
    setFilterCategory(category === 'All' ? '' : category)
    // Reset pagination when filtering
    setLastVisible(null)
  }

  // Handle delete menu item
  const handleDeleteItem = async (id: string) => {
    if (!id) return
    
    if (!confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
      return
    }
    
    try {
      const { db } = await connectToDatabase()
      if (!db) throw new Error('Database connection failed')
      
      const { ObjectId } = require('mongodb');
      const result = await db.collection('menuItems').deleteOne({ _id: new ObjectId(id) })
      
      if (result.deletedCount > 0) {
        setMenuItems(menuItems.filter(item => item.id !== id))
      } else {
        throw new Error('Failed to delete menu item')
      }
    } catch (err) {
      console.error('Error deleting menu item:', err)
      setError('Failed to delete menu item. Please try again.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
        <div className="flex space-x-2">
          <Link
            href="/admin/menu-items/new"
            className="inline-flex items-center px-3 py-2 border border-pink-600 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Item
          </Link>
          <div className="flex space-x-2">
            <button 
              onClick={() => exportToCSV(menuItems, `menu-items-${getFormattedDate()}.csv`)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              disabled={isLoading || menuItems.length === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>
            <button 
              onClick={() => exportToJSON(menuItems, `menu-items-${getFormattedDate()}.json`)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              disabled={isLoading || menuItems.length === 0}
            >
              <FileText className="h-4 w-4 mr-1" />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="sr-only">Search</button>
        </form>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filterCategory}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            onClick={() => {
              setSearchQuery('')
              setFilterCategory('')
              setSortBy('name')
              setSortDirection('asc')
              setLastVisible(null)
            }}
          >
            <Filter className="h-4 w-4 mr-1" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && menuItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="w-12 h-12 text-pink-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          {error}
        </div>
      )}
      
      {/* Menu Items Table */}
      {!isLoading && !error && menuItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500 mb-4">No menu items found matching your criteria.</p>
          <Link
            href="/admin/menu-items/new"
            className="inline-flex items-center px-4 py-2 border border-pink-600 shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Menu Item
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortBy === 'name' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {sortBy === 'price' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      Category
                      {sortBy === 'category' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('restaurant')}
                  >
                    <div className="flex items-center">
                      Restaurant
                      {sortBy === 'restaurant' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('available')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === 'available' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative h-12 w-12 rounded overflow-hidden">
                        <Image
                          src={item.imageUrl || '/placeholder-food.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.restaurantId?.toString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/menu-items/${item.id}`} 
                        className="text-pink-600 hover:text-pink-900 mr-3"
                      >
                        <Edit className="h-4 w-4 inline" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isLoading}
                      >
                        <Trash className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
              <button
                onClick={loadMoreItems}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
