"use client"

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Download,
  Eye,
  Edit,
  Trash,
  Users as UsersIcon,
  User,
  Mail,
  Phone,
  Calendar,
  Loader
} from 'lucide-react'
import { fetchUsers } from '@/lib/admin-firestore'
import { User as UserType } from '@/lib/firestore'
import { exportToCSV, exportToJSON, getFormattedDate } from '@/utils/export-data'

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true)
        const result = await fetchUsers(
          null, 
          10, 
          filterRole, 
          filterStatus, 
          searchQuery, 
          sortBy, 
          sortDirection
        )
        
        setUsers(result.users)
        setLastVisible(result.lastVisible)
        setHasMore(result.users.length === 10)
      } catch (err) {
        console.error('Error loading users:', err)
        setError('Failed to load users. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUsers()
  }, [filterRole, filterStatus, searchQuery, sortBy, sortDirection])

  // Load more users
  const loadMoreUsers = async () => {
    if (!lastVisible || !hasMore) return
    
    try {
      setIsLoading(true)
      const result = await fetchUsers(
        lastVisible, 
        10, 
        filterRole, 
        filterStatus, 
        searchQuery, 
        sortBy, 
        sortDirection
      )
      
      setUsers(prev => [...prev, ...result.users])
      setLastVisible(result.lastVisible)
      setHasMore(result.users.length === 10)
    } catch (err) {
      console.error('Error loading more users:', err)
      setError('Failed to load more users. Please try again.')
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
  const handleRoleFilter = (role: string) => {
    setFilterRole(role)
    // Reset pagination when filtering
    setLastVisible(null)
  }

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status)
    // Reset pagination when filtering
    setLastVisible(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => exportToCSV(users, `users-${getFormattedDate()}.csv`)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            disabled={isLoading || users.length === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </button>
          <button 
            onClick={() => exportToJSON(users, `users-${getFormattedDate()}.json`)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            disabled={isLoading || users.length === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="sr-only">Search</button>
        </form>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filterRole}
            onChange={(e) => handleRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="restaurant_owner">Restaurant Owner</option>
          </select>
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filterStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            onClick={() => {
              setSearchQuery('')
              setFilterRole('')
              setFilterStatus('')
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
      {isLoading && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="w-12 h-12 text-pink-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          {error}
        </div>
      )}
      
      {/* Users Table */}
      {!isLoading && !error && users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500 mb-4">No users found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setFilterRole('')
              setFilterStatus('')
              setSortBy('name')
              setSortDirection('asc')
              setLastVisible(null)
            }}
            className="inline-flex items-center px-4 py-2 border border-pink-600 shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
          >
            <UsersIcon className="h-4 w-4 mr-2" />
            View All Users
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      {sortBy === 'email' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center">
                      Role
                      {sortBy === 'role' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('orders')}
                  >
                    <div className="flex items-center">
                      Orders
                      {sortBy === 'orders' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('joinDate')}
                  >
                    <div className="flex items-center">
                      Join Date
                      {sortBy === 'joinDate' && (
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
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-pink-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                          user.role === 'restaurant_owner' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {user.role === 'admin' ? 'Admin' : 
                         user.role === 'restaurant_owner' ? 'Restaurant Owner' : 
                         'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {user.joinDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="text-pink-600 hover:text-pink-900 mr-3"
                      >
                        <Eye className="h-4 w-4 inline" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit className="h-4 w-4 inline" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
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
                onClick={loadMoreUsers}
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-pink-100 h-32 w-32 rounded-full flex items-center justify-center mx-auto">
                    <User className="h-16 w-16 text-pink-600" />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-medium text-gray-900">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-500">{selectedUser.role === 'admin' ? 'Admin' : 
                      selectedUser.role === 'restaurant_owner' ? 'Restaurant Owner' : 
                      'Customer'}</p>
                    <span className={`mt-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="mt-1">{selectedUser.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                      <p className="mt-1">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Join Date</h4>
                      <p className="mt-1">{selectedUser.joinDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Last Login</h4>
                      <p className="mt-1">{selectedUser.lastLogin}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Total Orders</h4>
                      <p className="mt-1">{selectedUser.orders}</p>
                    </div>
                    {selectedUser.address && (
                      <div className="col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">Address</h4>
                        <p className="mt-1">{selectedUser.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 mr-2"
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700"
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
