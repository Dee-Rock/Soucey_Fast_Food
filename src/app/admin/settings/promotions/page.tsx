"use client"

import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Calendar, Tag, Edit, Save } from 'lucide-react'
import Link from 'next/link'

// Mock data for promotions
const initialPromotions = [
  {
    id: '1',
    code: 'WELCOME20',
    discount: 20,
    discountType: 'percentage',
    description: 'Welcome discount for new users',
    startDate: '2025-05-01',
    endDate: '2025-06-30',
    minOrderAmount: 50,
    maxDiscount: 100,
    usageLimit: 1,
    isActive: true
  },
  {
    id: '2',
    code: 'CAMPUS10',
    discount: 10,
    discountType: 'percentage',
    description: 'Special discount for campus students',
    startDate: '2025-05-15',
    endDate: '2025-07-15',
    minOrderAmount: 30,
    maxDiscount: 50,
    usageLimit: 5,
    isActive: true
  },
  {
    id: '3',
    code: 'FREESHIP',
    discount: 15,
    discountType: 'fixed',
    description: 'Free shipping on all orders',
    startDate: '2025-05-10',
    endDate: '2025-05-31',
    minOrderAmount: 100,
    maxDiscount: 15,
    usageLimit: 2,
    isActive: false
  }
]

interface Promotion {
  id: string
  code: string
  discount: number
  discountType: 'percentage' | 'fixed'
  description: string
  startDate: string
  endDate: string
  minOrderAmount: number
  maxDiscount: number
  usageLimit: number
  isActive: boolean
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  
  const [formData, setFormData] = useState<Promotion>({
    id: '',
    code: '',
    discount: 0,
    discountType: 'percentage',
    description: '',
    startDate: '',
    endDate: '',
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 1,
    isActive: true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'number' 
          ? parseFloat(value) 
          : value
    })
  }

  const handleAddNew = () => {
    setIsAddingNew(true)
    setEditingPromotion(null)
    setFormData({
      id: `${Date.now()}`, // Generate a temporary ID
      code: '',
      discount: 0,
      discountType: 'percentage',
      description: '',
      startDate: '',
      endDate: '',
      minOrderAmount: 0,
      maxDiscount: 0,
      usageLimit: 1,
      isActive: true
    })
  }

  const handleEdit = (promotion: Promotion) => {
    setIsAddingNew(false)
    setEditingPromotion(promotion)
    setFormData({ ...promotion })
  }

  const handleDelete = (id: string) => {
    setPromotions(promotions.filter(promo => promo.id !== id))
    if (editingPromotion?.id === id) {
      setEditingPromotion(null)
      setIsAddingNew(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isAddingNew) {
      setPromotions([...promotions, formData])
    } else if (editingPromotion) {
      setPromotions(promotions.map(promo => 
        promo.id === editingPromotion.id ? formData : promo
      ))
    }
    
    setIsAddingNew(false)
    setEditingPromotion(null)
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingPromotion(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/settings" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold">Promotions & Discounts</h1>
        </div>
        
        {!isAddingNew && !editingPromotion && (
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Promotion
          </button>
        )}
      </div>

      {/* Form for adding/editing promotions */}
      {(isAddingNew || editingPromotion) && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">
              {isAddingNew ? 'Add New Promotion' : 'Edit Promotion'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g. WELCOME20"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Brief description of the promotion"
                />
              </div>
              
              <div>
                <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type *
                </label>
                <select
                  id="discountType"
                  name="discountType"
                  required
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (GHS)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value *
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  required
                  min="0"
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={formData.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 15.00'}
                />
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="minOrderAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Amount (GHS)
                </label>
                <input
                  type="number"
                  id="minOrderAmount"
                  name="minOrderAmount"
                  min="0"
                  step="0.01"
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0 for no minimum"
                />
              </div>
              
              <div>
                <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Discount Amount (GHS)
                </label>
                <input
                  type="number"
                  id="maxDiscount"
                  name="maxDiscount"
                  min="0"
                  step="0.01"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0 for no maximum"
                />
              </div>
              
              <div>
                <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit Per User
                </label>
                <input
                  type="number"
                  id="usageLimit"
                  name="usageLimit"
                  min="0"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0 for unlimited"
                />
              </div>
              
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
                  Active (Promotion can be used by customers)
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <Save className="h-4 w-4 mr-2" />
                {isAddingNew ? 'Add Promotion' : 'Update Promotion'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of promotions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Active Promotions</h2>
        </div>
        
        <div className="overflow-x-auto">
          {promotions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min. Order
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
                {promotions.map((promotion) => (
                  <tr key={promotion.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {promotion.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promotion.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promotion.discountType === 'percentage' 
                        ? `${promotion.discount}%` 
                        : `GHS ${promotion.discount.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>
                          {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promotion.minOrderAmount > 0 ? `GHS ${promotion.minOrderAmount.toFixed(2)}` : 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {promotion.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(promotion)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(promotion.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Promotions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new promotion.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Promotion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
