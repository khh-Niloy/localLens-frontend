"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useGetWishlistQuery } from '@/redux/features/wishlist/wishlist.api';
import { Calendar, Users, MapPin, TrendingUp, Clock, CheckCircle, Star, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: meData, isLoading } = useGetMeQuery(undefined);
  const me = meData as any;

  // Redirect guides to My Tours page
  useEffect(() => {
    if (!isLoading && me?.role?.toLowerCase() === 'guide') {
      router.replace('/dashboard/my-tours');
    }
  }, [me, isLoading, router]);

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

  const renderTouristDashboard = () => {
    const { data: wishlistData } = useGetWishlistQuery({}, { skip: !me || me.role !== 'TOURIST' });
    const wishlistCount = wishlistData?.data?.length || 0;

    return (
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
              <p className="text-2xl font-bold text-yellow-600">{wishlistCount}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Trips */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Upcoming Trips</h2>
            <a 
              href="/dashboard/all-bookings"
              className="text-[#1FB67A] hover:text-[#1dd489] text-sm font-medium"
            >
              View All
            </a>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">No upcoming trips found.</p>
            <div className="text-center">
              <a 
                href="/explore-tours"
                className="inline-block bg-[#1FB67A] text-white px-4 py-2 rounded-md hover:bg-[#1dd489] transition-colors text-sm"
              >
                Browse Tours
              </a>
            </div>
          </div>
        </div>

        {/* Wishlist */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Wishlist</h2>
            <a 
              href="/dashboard/wishlist"
              className="text-[#1FB67A] hover:text-[#1dd489] text-sm font-medium"
            >
              View All
            </a>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">No items in wishlist.</p>
            <div className="text-center">
              <a 
                href="/dashboard/wishlist"
                className="inline-block border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                Explore Wishlist
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Tourists */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/dashboard/all-bookings"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#1FB67A]" />
                <span>View Upcoming Trips</span>
              </div>
              <span className="text-gray-400">→</span>
            </a>
            
            <a 
              href="/dashboard/past-bookings"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span>View Past Trips</span>
              </div>
              <span className="text-gray-400">→</span>
            </a>
            
            <a 
              href="/dashboard/wishlist"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-600" />
                <span>Manage Wishlist</span>
              </div>
              <span className="text-gray-400">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    );
  };

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
              <a 
                href="/admin/users"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#1FB67A]" />
                  <span>Manage Users</span>
                </div>
                <span className="text-gray-400">→</span>
              </a>
              
              <a 
                href="/admin/listings"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Review Listings</span>
                </div>
                <span className="text-gray-400">→</span>
              </a>
              
              <a 
                href="/admin/bookings"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>Booking Management</span>
                </div>
                <span className="text-gray-400">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading while checking user role or redirecting
  if (isLoading || !me) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If guide, show loading while redirecting (should redirect immediately)
  if (me.role?.toLowerCase() === 'guide') {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>Redirecting to My Tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {me.role?.toLowerCase() === 'tourist' && renderTouristDashboard()}
      {me.role?.toLowerCase() === 'admin' && renderAdminDashboard()}
    </div>
  );
}
