"use client"

import React, { useState } from 'react';
import { UserProfile, useUser } from '@clerk/nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBag, MapPin, CreditCard, Settings, Clock, Phone } from 'lucide-react';
import Link from 'next/link';

// Sample order history data
const orderHistory = [
  {
    id: 'ORD-123456',
    date: '2025-05-20',
    status: 'Delivered',
    total: 85.97,
    items: [
      { name: 'Jollof Rice with Chicken', quantity: 2, price: 35.99 },
      { name: 'Kelewele', quantity: 1, price: 13.99 },
    ],
    restaurant: 'Ghana Kitchen',
  },
  {
    id: 'ORD-123457',
    date: '2025-05-15',
    status: 'Delivered',
    total: 55.99,
    items: [
      { name: 'Pizza Supreme', quantity: 1, price: 55.99 },
    ],
    restaurant: 'Pizza Corner',
  },
  {
    id: 'ORD-123458',
    date: '2025-05-10',
    status: 'Delivered',
    total: 76.98,
    items: [
      { name: 'Banku with Tilapia', quantity: 1, price: 45.99 },
      { name: 'Fruit Smoothie', quantity: 2, price: 15.99 },
    ],
    restaurant: 'Accra Delights',
  },
];

// Sample address data
const addresses = [
  {
    id: 1,
    name: 'Campus Dorm',
    address: 'Room 203, Block B, University Hostel',
    campus: 'University of Ghana, Legon',
    phone: '+233 20 123 4567',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Off-Campus Apartment',
    address: 'Apt 5, Green Building, University Road',
    campus: 'Near University of Ghana',
    phone: '+233 20 123 4567',
    isDefault: false,
  },
];

// Sample payment methods
const paymentMethods = [
  {
    id: 1,
    type: 'Card',
    name: 'Visa ending in 4242',
    expiryDate: '05/26',
    isDefault: true,
  },
  {
    id: 2,
    type: 'Mobile Money',
    name: 'MTN Mobile Money',
    number: '+233 20 123 4567',
    isDefault: false,
  },
];

const ProfilePage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState('account');
  const { toast } = useToast();
  
  const [profileForm, setProfileForm] = useState({
    phone: '+233 20 123 4567',
    campus: 'University of Ghana, Legon',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
      duration: 3000,
    });
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
        <p className="text-gray-600 mb-6">You need to be signed in to view your profile.</p>
        <Button asChild className="bg-pink-600 hover:bg-pink-700">
          <Link href="/sign-in">
            Sign In
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
      <p className="text-gray-600 mb-8">Manage your account and preferences</p>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
              <TabsList className="flex flex-col items-start space-y-2 w-full">
                <TabsTrigger value="account" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </TabsTrigger>
                <TabsTrigger value="orders" className="w-full justify-start">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Order History
                </TabsTrigger>
                <TabsTrigger value="addresses" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Delivery Addresses
                </TabsTrigger>
                <TabsTrigger value="payments" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Methods
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="bg-pink-50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Contact our support team if you have any questions or issues.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full border-pink-500 text-pink-600 hover:bg-pink-100">
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <TabsContent value="account" className="mt-0">
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-1">
                        Campus/Area
                      </label>
                      <Input
                        id="campus"
                        name="campus"
                        value={profileForm.campus}
                        onChange={handleProfileChange}
                        placeholder="Your campus or area"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                    Save Changes
                  </Button>
                </form>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Account Management</h3>
                <div className="space-y-4">
                  <div>
                    <Button variant="outline" className="w-full justify-start text-left">
                      Change Password
                    </Button>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full justify-start text-left">
                      Email Preferences
                    </Button>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="orders" className="mt-0">
              <h2 className="text-xl font-semibold mb-6">Order History</h2>
              
              {orderHistory.length > 0 ? (
                <div className="space-y-6">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold">{order.id}</h3>
                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{order.restaurant}</span>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className="font-semibold">GHS {order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-medium mb-2">Order Items</h4>
                        <ul className="space-y-2">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="text-pink-600 border-pink-500 hover:bg-pink-50">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                  <Button asChild className="bg-pink-600 hover:bg-pink-700">
                    <Link href="/menu">
                      Browse Menu
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="addresses" className="mt-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Delivery Addresses</h2>
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Add New Address
                </Button>
              </div>
              
              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4 relative">
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      <h3 className="font-semibold mb-1">{address.name}</h3>
                      <p className="text-sm text-gray-700 mb-1">{address.address}</p>
                      <p className="text-sm text-gray-700 mb-1">{address.campus}</p>
                      <p className="text-sm text-gray-700 mb-3">{address.phone}</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        {!address.isDefault && (
                          <Button variant="outline" size="sm">
                            Set as Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                  <p className="text-gray-600 mb-4">Add a delivery address to make ordering faster.</p>
                  <Button className="bg-pink-600 hover:bg-pink-700">
                    Add New Address
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="payments" className="mt-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Payment Methods</h2>
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Add Payment Method
                </Button>
              </div>
              
              {paymentMethods.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border rounded-lg p-4 relative">
                      {method.isDefault && (
                        <span className="absolute top-2 right-2 bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      <div className="flex items-center mb-3">
                        {method.type === 'Card' ? (
                          <CreditCard className="w-8 h-8 text-gray-600 mr-3" />
                        ) : (
                          <Phone className="w-8 h-8 text-gray-600 mr-3" />
                        )}
                        <div>
                          <h3 className="font-semibold">{method.name}</h3>
                          {method.type === 'Card' && (
                            <p className="text-sm text-gray-600">Expires: {method.expiryDate}</p>
                          )}
                          {method.type === 'Mobile Money' && (
                            <p className="text-sm text-gray-600">{method.number}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!method.isDefault && (
                          <Button variant="outline" size="sm">
                            Set as Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No payment methods saved</h3>
                  <p className="text-gray-600 mb-4">Add a payment method to make checkout faster.</p>
                  <Button className="bg-pink-600 hover:bg-pink-700">
                    Add Payment Method
                  </Button>
                </div>
              )}
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
