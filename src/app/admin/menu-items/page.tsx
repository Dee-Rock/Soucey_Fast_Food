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
  Loader,
  Star
} from 'lucide-react'
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data'
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
  const [categories, setCategories] = useState<string[]>([])

  // Load menu items from MongoDB API
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/menu-items')
        
        if (!response.ok) {
          throw new Error('Failed to fetch menu items')
        }
        
        const data = await response.json()
        setMenuItems(data)
        
        // Extract unique categories
        const uniqueCategories = new Set<string>()
        data.forEach((item: IMenuItem) => {
          if (item.category) {
            uniqueCategories.add(item.category)
          }
        })
        setCategories(Array.from(uniqueCategories))
      } catch (err) {
        console.error('Error fetching menu items:', err)
        setError('Failed to load menu items. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadMenuItems()
  }, [])

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle category filter
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value)
  }

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
  }

  // Handle delete menu item
  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
      try {
        // Delete from MongoDB
        const response = await fetch(`/api/menu-items/${id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete menu item')
        }
        
        // Update local state
        setMenuItems(menuItems.filter(item => item._id !== id && item.id !== id) as IMenuItem[])
      } catch (err) {
        console.error('Error deleting menu item:', err)
        alert('Failed to delete menu item. Please try again.')
      }
    }
  }

  // Toggle featured status
  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      // Update in MongoDB
      const response = await fetch(`/api/menu-items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: !featured }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update menu item')
      }
      
      // Update local state
      setMenuItems(menuItems.map(item => {
        if (item._id === id || item.id === id) {
          return { ...item, isFeatured: !featured } as IMenuItem;
        }
        return item;
      }))
    } catch (err) {
      console.error('Error updating menu item:', err)
      alert('Failed to update menu item. Please try again.')
    }
  }

  // Filter and sort menu items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !filterCategory || item.category === filterCategory
    
    return matchesSearch && matchesCategory
  })

  const sortedMenuItems = [...filteredMenuItems].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    } else if (sortBy === 'price') {
      return sortDirection === 'asc' ? a.price - b.price : b.price - a.price
    } else if (sortBy === 'category') {
      return sortDirection === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category)
    } else {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }
  })

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
            Add New Item
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

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search menu items..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none"
              value={filterCategory}
              onChange={handleCategoryFilter}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
          <Loader className="h-8 w-8 text-pink-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading menu items...</span>
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

      {/* Menu Items Table */}
      {!isLoading && !error && menuItems.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="h-12 w-12 text-gray-400 mx-auto mb-4">🍽️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No menu items found</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first menu item.</p>
          <Link 
            href="/admin/menu-items/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Link>
        </div>
      )}

      {!isLoading && !error && menuItems.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      {sortBy === 'name' && (
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
                      {sortBy === 'price' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('category')}
                    >
                      Category
                      {sortBy === 'category' && (
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
                  <tr key={item._id || item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative h-12 w-12 rounded overflow-hidden">
                        <Image
                          src={item.imageUrl || '/images/placeholder-food.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                          priority={false}
                          quality={75}
                          onError={(e: any) => {
                            e.target.src = '/images/placeholder-food.jpg';
                          }}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/menu-items/edit/${item._id || item.id}`} 
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <Edit className="h-4 w-4 inline" />
                      </Link>
                      <button
                        onClick={() => handleToggleFeatured(item._id?.toString() || item.id!, item.isFeatured)}
                        className="text-yellow-600 hover:text-yellow-800 mr-3"
                        title={item.isFeatured ? 'Remove from featured' : 'Add to featured'}
                      >
                        <Star className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id?.toString() || item.id!)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete item"
                      >
                        <Trash className="h-4 w-4 inline" />
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