"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { UserService } from '@/lib/db-service'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: Date;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        if (data.success) {
          setUsers(data.users)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch users',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Reset to first page when searching
    setCurrentPage(1)
  }

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort direction if same column is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Default to ascending sort for new column
      setSortBy(column)
      setSortDirection('asc')
    }
    // Reset to first page when changing sort
    setCurrentPage(1)
  }

  // Handle filter
  const handleRoleFilter = (role: string) => {
    setFilterRole(role)
    // Reset to first page when filtering
    setCurrentPage(1)
  }

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status)
    // Reset to first page when filtering
    setCurrentPage(1)
  }

  if (isLoading) {
    return <div>Loading users...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Input
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <Card key={user._id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">{user.phone}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {user.role}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
