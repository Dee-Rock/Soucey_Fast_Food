"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle, XCircle, Database, ArrowLeft } from 'lucide-react'
import { seedDatabase } from '@/lib/seed-data'

export default function SeedDatabasePage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSeedDatabase = async () => {
    try {
      setIsSeeding(true)
      setError(null)
      
      const success = await seedDatabase()
      
      if (success) {
        setIsComplete(true)
      } else {
        setError('Failed to seed database. Please check the console for more details.')
      }
    } catch (err) {
      console.error('Error seeding database:', err)
      setError('An unexpected error occurred while seeding the database.')
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Seed Database</h1>
          <Link 
            href="/admin" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start mb-4">
            <Database className="h-8 w-8 text-pink-600 mr-3 mt-1" />
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">Initialize Firebase Database</h2>
              <p className="text-gray-600 mb-4">
                This will populate your Firebase Firestore database with sample data for restaurants, menu items, 
                orders, payments, and users. This is useful for testing and development purposes.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-yellow-700 text-sm">
                  <strong>Note:</strong> Make sure you have set up your Firebase configuration in the .env.local file 
                  before proceeding. This operation will add new data to your database.
                </p>
              </div>
              
              {!isComplete && !isSeeding && (
                <button
                  onClick={handleSeedDatabase}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  disabled={isSeeding}
                >
                  Initialize Database with Sample Data
                </button>
              )}
              
              {isSeeding && (
                <div className="flex items-center text-gray-600">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin text-pink-600" />
                  <span>Seeding database... This may take a moment.</span>
                </div>
              )}
              
              {isComplete && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Database seeded successfully! You can now navigate to the admin pages to view the data.</span>
                </div>
              )}
              
              {error && (
                <div className="flex items-center text-red-600 mt-3">
                  <XCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isComplete && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Next Steps</h3>
            <p className="text-gray-600 mb-4">
              Your database has been populated with sample data. You can now explore the admin pages to view and manage this data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/admin/restaurants" 
                className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50 text-center"
              >
                View Restaurants
              </Link>
              <Link 
                href="/admin/menu-items" 
                className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50 text-center"
              >
                View Menu Items
              </Link>
              <Link 
                href="/admin/orders" 
                className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50 text-center"
              >
                View Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
