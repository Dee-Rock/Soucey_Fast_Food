"use client"

import { useState } from 'react'
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
  Calendar
} from 'lucide-react'

// Mock data for users
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+233 50 123 4567',
    role: 'customer',
    status: 'active',
    orders: 12,
    totalSpent: 'GHS 1,245.50',
    joinDate: '15 Jan, 2025',
    lastLogin: '25 May, 2025',
    address: 'Room 203, Legon Hall, University of Ghana'
  },
  {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    phone: '+233 55 987 6543',
    role: 'customer',
    status: 'active',
    orders: 8,
    totalSpent: 'GHS 785.25',
    joinDate: '22 Feb, 2025',
    lastLogin: '24 May, 2025',
    address: 'Block B, Room 12, KNUST Campus'
  },
  {
    id: 3,
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    phone: '+233 24 555 7890',
    role: 'customer',
    status: 'inactive',
    orders: 3,
    totalSpent: 'GHS 210.75',
    joinDate: '10 Mar, 2025',
    lastLogin: '15 Apr, 2025',
    address: 'Apartment 5, Achimota College Road'
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    phone: '+233 20 111 2222',
    role: 'customer',
    status: 'active',
    orders: 6,
    totalSpent: 'GHS 450.00',
    joinDate: '05 Apr, 2025',
    lastLogin: '23 May, 2025',
    address: 'Room 118, Volta Hall, University of Ghana'
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.b@example.com',
    phone: '+233 27 333 4444',
    role: 'admin',
    status: 'active',
    orders: 0,
    totalSpent: 'GHS 0.00',
    joinDate: '01 Jan, 2025',
    lastLogin: '25 May, 2025',
    address: 'House 7, Atomic Road, Accra'
  },
  {
    id: 6,
    name: 'Olivia Parker',
    email: 'olivia.p@example.com',
    phone: '+233 54 777 8888',
    role: 'customer',
    status: 'active',
    orders: 4,
    totalSpent: 'GHS 355.50',
    joinDate: '18 Apr, 2025',
    lastLogin: '22 May, 2025',
    address: 'Block 4, Room 8, Central University Campus'
  },
  {
    id: 7,
    name: 'James Wilson',
    email: 'james.w@example.com',
    phone: '+233 26 999 0000',
    role: 'driver',
    status: 'active',
    orders: 0,
    totalSpent: 'GHS 0.00',
    joinDate: '12 Mar, 2025',
    lastLogin: '25 May, 2025',
    address: 'House 15, East Legon Hills'
  },
  {
    id: 8,
    name: 'Sophia Lee',
    email: 'sophia.l@example.com',
    phone: '+233 23 444 5555',
    role: 'restaurant_owner',
    status: 'active',
    orders: 0,
    totalSpent: 'GHS 0.00',
    joinDate: '20 Feb, 2025',
    lastLogin: '24 May, 2025',
    address: 'Apartment 12, Airport Residential Area'
  }
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedUser, setSelectedUser] = useState<number | null>(null)

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    } else if (sortField === 'joinDate') {
      return sortDirection === 'asc' 
        ? new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
        : new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
    } else if (sortField === 'orders') {
      return sortDirection === 'asc' ? a.orders - b.orders : b.orders - a.orders
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

  // Count users by role
  const customerCount = users.filter(user => user.role === 'customer').length
  const adminCount = users.filter(user => user.role === 'admin').length
  const driverCount = users.filter(user => user.role === 'driver').length
  const restaurantOwnerCount = users.filter(user => user.role === 'restaurant_owner').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <button className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Export Users
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold mt-1">{users.length}</p>
            </div>
            <div className="bg-pink-50 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Customers</p>
              <p className="text-2xl font-semibold mt-1">{customerCount}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Drivers</p>
              <p className="text-2xl font-semibold mt-1">{driverCount}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <User className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Restaurant Owners</p>
              <p className="text-2xl font-semibold mt-1">{restaurantOwnerCount}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <User className="h-6 w-6 text-yellow-600" />
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
              placeholder="Search users by name, email or phone..."
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers</option>
                <option value="admin">Admins</option>
                <option value="driver">Drivers</option>
                <option value="restaurant_owner">Restaurant Owners</option>
              </select>
            </div>
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
          </div>
        </div>
      </div>

      {/* Users Table */}
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
                    User
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
                  Role
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
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('joinDate')}
                  >
                    Joined
                    {sortField === 'joinDate' && (
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
              {sortedUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className={`hover:bg-gray-50 ${selectedUser === user.id ? 'bg-pink-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
                        {/* In a real app, you would display the user avatar here */}
                        <div className="h-full w-full flex items-center justify-center bg-pink-100 text-pink-600">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <button 
                          className="text-sm font-medium text-gray-900"
                          onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                        >
                          {user.name}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-gray-400" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-400" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'driver' ? 'bg-green-100 text-green-800' : 
                        user.role === 'restaurant_owner' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{user.orders}</div>
                    <div className="text-xs">{user.totalSpent}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {user.joinDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-pink-600 hover:text-pink-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Details Expandable Section */}
        {selectedUser && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {users.filter(user => user.id === selectedUser).map(user => (
              <div key={`details-${user.id}`}>
                <h3 className="text-lg font-medium mb-4">User Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Personal Information</h4>
                    <p className="text-sm mb-1"><span className="font-medium">Name:</span> {user.name}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Email:</span> {user.email}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Phone:</span> {user.phone}</p>
                    <p className="text-sm"><span className="font-medium">Address:</span> {user.address}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Account Information</h4>
                    <p className="text-sm mb-1"><span className="font-medium">Role:</span> {user.role.replace('_', ' ')}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Status:</span> {user.status}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Join Date:</span> {user.joinDate}</p>
                    <p className="text-sm"><span className="font-medium">Last Login:</span> {user.lastLogin}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Order Information</h4>
                    <p className="text-sm mb-1"><span className="font-medium">Total Orders:</span> {user.orders}</p>
                    <p className="text-sm"><span className="font-medium">Total Spent:</span> {user.totalSpent}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium">
                    View Order History
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
                    Edit User
                  </button>
                  {user.status === 'active' ? (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium">
                      Deactivate User
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium">
                      Activate User
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
