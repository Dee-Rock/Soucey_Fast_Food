"use client"

import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  CreditCard, 
  Bell, 
  Lock, 
  Globe, 
  Truck, 
  MessageSquare,
  Save
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Settings Tabs */}
          <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'general' ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <SettingsIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                General
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'payment' ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="mr-3 h-5 w-5 flex-shrink-0" />
                Payment
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'notifications' ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bell className="mr-3 h-5 w-5 flex-shrink-0" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'security' ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Lock className="mr-3 h-5 w-5 flex-shrink-0" />
                Security
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'delivery' ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Truck className="mr-3 h-5 w-5 flex-shrink-0" />
                Delivery
              </button>
              <button
                onClick={() => setActiveTab('localization')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'localization' ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Globe className="mr-3 h-5 w-5 flex-shrink-0" />
                Localization
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'support' ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="mr-3 h-5 w-5 flex-shrink-0" />
                Support
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6">
            {activeTab === 'general' && (
              <div>
                <h2 className="text-lg font-medium mb-4">General Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue="Soucey Food Delivery"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue="admin@soucey.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue="+233 50 123 4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue="Soucey is a food delivery platform designed for campus life in Ghana, offering a wide range of local and international cuisines."
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="maintenance-mode"
                      type="checkbox"
                      className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                    <label htmlFor="maintenance-mode" className="ml-2 block text-sm text-gray-700">
                      Enable Maintenance Mode
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Payment Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Paystack Public Key
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Paystack Secret Key
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="GHS">Ghana Cedi (GHS)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="NGN">Nigerian Naira (NGN)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Enabled Payment Methods
                    </label>
                    <div className="flex items-center">
                      <input
                        id="mobile-money"
                        type="checkbox"
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="mobile-money" className="ml-2 block text-sm text-gray-700">
                        Mobile Money
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="card-payment"
                        type="checkbox"
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="card-payment" className="ml-2 block text-sm text-gray-700">
                        Card Payment
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="cash-delivery"
                        type="checkbox"
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="cash-delivery" className="ml-2 block text-sm text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Delivery Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Delivery Fee (GHS)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue="10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Delivery Distance (km)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue="15"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Delivery Time (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue="45"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="free-delivery"
                      type="checkbox"
                      className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                    <label htmlFor="free-delivery" className="ml-2 block text-sm text-gray-700">
                      Enable Free Delivery for Orders Above:
                    </label>
                    <input
                      type="number"
                      className="ml-2 w-24 px-3 py-1 border border-gray-300 rounded-md"
                      defaultValue="100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
            {(activeTab === 'notifications' || activeTab === 'security' || activeTab === 'localization' || activeTab === 'support') && (
              <div className="text-center py-12">
                <SettingsIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Settings Coming Soon</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This settings section is under development and will be available soon.
                </p>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
