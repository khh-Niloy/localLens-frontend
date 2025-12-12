"use client";
import React from 'react';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { Calendar, Users, MapPin, TrendingUp, Clock, CheckCircle, Star, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { data: meData } = useGetMeQuery(undefined);
  const me = meData as any;

  const renderGuideDashboard = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Guide Dashboard</h1>
        <p className="text-gray-600">Welcome back, {me?.name}! Here's your tour business overview.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Bookings</p>
              <p className="text-2xl font-bold text-[#1FB67A]">0</p>
            </div>
            <Calendar className="w-8 h-8 text-[#1FB67A]" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month Revenue</p>
              <p className="text-2xl font-bold text-green-600">$0</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">No upcoming bookings found.</p>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Reviews</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">No reviews yet.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTouristDashboard = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
        <p className="text-gray-600">Welcome back, {me?.name}! Plan your next adventure.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Trips</p>
              <p className="text-2xl font-bold text-[#1FB67A]">0</p>
            </div>
            <Calendar className="w-8 h-8 text-[#1FB67A]" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Past Trips</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Wishlist</p>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Trips */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Upcoming Trips</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">No upcoming trips found.</p>
          </div>
        </div>

        {/* Wishlist */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Wishlist</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">No items in wishlist.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and management tools.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-[#1FB67A]">0</p>
            </div>
            <Users className="w-8 h-8 text-[#1FB67A]" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue (Month)</p>
              <p className="text-2xl font-bold text-purple-600">$0</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">No recent activity.</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#1FB67A]" />
                  <span>Manage Users</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Review Listings</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>Booking Reports</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>Analytics</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!me) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {me.role?.toLowerCase() === 'guide' && renderGuideDashboard()}
      {me.role?.toLowerCase() === 'tourist' && renderTouristDashboard()}
      {me.role?.toLowerCase() === 'admin' && renderAdminDashboard()}
    </div>
  );
}
