"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Settings as SettingsIcon, 
  CreditCard, 
  Bell, 
  Lock, 
  Globe, 
  Truck, 
  MessageSquare,
  Save,
  Loader2
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="h-4 w-4 mr-2" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4 mr-2" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4 mr-2" /> },
    { id: 'security', label: 'Security', icon: <Lock className="h-4 w-4 mr-2" /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck className="h-4 w-4 mr-2" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                  placeholder="Your business name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                  placeholder="contact@example.com"
                />
              </div>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Billing Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <span>Payment Methods</span>
              </div>
              <p className="text-sm text-gray-500">Manage your payment methods and billing information</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-2" />
                <span>Email Notifications</span>
              </div>
              <p className="text-sm text-gray-500">Configure your notification preferences</p>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-gray-400 mr-2" />
                <span>Change Password</span>
              </div>
              <p className="text-sm text-gray-500">Update your password and security settings</p>
            </div>
          </div>
        );
      case 'shipping':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Shipping Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-gray-400 mr-2" />
                <span>Delivery Zones</span>
              </div>
              <p className="text-sm text-gray-500">Configure your delivery areas and fees</p>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Message Templates</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                <span>Customer Messages</span>
              </div>
              <p className="text-sm text-gray-500">Customize your automated messages</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <Save className="-ml-1 mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${activeTab === tab.id
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {renderTabContent()}
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
