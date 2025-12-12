"use client";
import React, { useState } from 'react';
import { Plus, Edit, Eye, Trash2, Star, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
// TODO: Import and use actual API hook when booking API is available
// import { useGetMyToursQuery } from '@/redux/features/tour/tour.api';

export default function ListingManagementPage() {
  // TODO: Replace with actual API call to get user's listings
  // const { data: toursData } = useGetMyToursQuery({});
  // const listings = toursData?.data || [];
  const listings: any[] = [];
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created');

  const filteredListings = listings.filter(listing => {
    if (filterStatus === 'all') return true;
    return listing.status === filterStatus;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'revenue':
        return b.revenue - a.revenue;
      case 'rating':
        return b.rating - a.rating;
      case 'bookings':
        return b.bookings - a.bookings;
      default:
        return 0;
    }
  });

  const totalStats = {
    totalListings: listings.length,
    activeListings: listings.filter(l => l.status === 'active').length,
    totalRevenue: listings.reduce((sum, l) => sum + l.revenue, 0),
    totalBookings: listings.reduce((sum, l) => sum + l.bookings, 0),
    averageRating: listings.filter(l => l.rating > 0).reduce((sum, l) => sum + l.rating, 0) / listings.filter(l => l.rating > 0).length || 0
  };

  const handleDeleteListing = (id: string) => {
    // TODO: Implement API call to delete listing
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span>Are you sure you want to delete this listing?</span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              // TODO: Call delete API endpoint
              // await deleteTour(id);
              toast.dismiss(t.id);
              toast.success('Listing deleted successfully');
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'deactivate': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600">Manage your tour listings and track performance</p>
        </div>
        <Link
          href="/dashboard/create-tour"
          className="bg-[#1FB67A] text-white px-4 py-2 rounded-md hover:bg-[#1dd489] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Tour
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Listings</p>
              <p className="text-xl font-bold text-gray-900">{totalStats.totalListings}</p>
            </div>
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-[#1FB67A]">{totalStats.activeListings}</p>
            </div>
            <Eye className="w-6 h-6 text-[#1FB67A]" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold text-green-600">${totalStats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-xl font-bold text-purple-600">{totalStats.totalBookings}</p>
            </div>
            <Users className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-xl font-bold text-yellow-600">{totalStats.averageRating.toFixed(1)}</p>
            </div>
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="deactivate">Deactivate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
              >
                <option value="created">Date Created</option>
                <option value="revenue">Revenue</option>
                <option value="rating">Rating</option>
                <option value="bookings">Bookings</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {sortedListings.length} of {listings.length} listings
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="space-y-4">
        {sortedListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-lg shadow border p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image */}
              <div className="flex-shrink-0">
                <div className="w-full lg:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  {listing.images.length > 0 ? (
                    <span className="text-gray-500">Tour Image</span>
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{listing.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{listing.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Duration: {listing.duration}h</span>
                      <span>Max {listing.maxGroupSize} guests</span>
                      <span>Category: {listing.category}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusColor(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#1FB67A]">${listing.price}</p>
                    <p className="text-xs text-gray-500">Price</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-bold">{listing.rating > 0 ? listing.rating.toFixed(1) : 'N/A'}</span>
                    </div>
                    <p className="text-xs text-gray-500">({listing.reviewCount} reviews)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600">{listing.bookings}</p>
                    <p className="text-xs text-gray-500">Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">${listing.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {listing.lastBooking ? new Date(listing.lastBooking).toLocaleDateString() : 'No bookings'}
                    </p>
                    <p className="text-xs text-gray-500">Last booking</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/tours/${listing.id}`}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <Link
                    href={`/dashboard/edit-tour/${listing.id}`}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <Link
                    href={`/dashboard/tour-bookings/${listing.id}`}
                    className="flex items-center gap-1 px-3 py-1 bg-[#1FB67A] text-white rounded text-sm hover:bg-[#1dd489] transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Bookings ({listing.bookings})
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedListings.length === 0 && (
        <div className="bg-white rounded-lg shadow border p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600 mb-6">
            {filterStatus === 'all' 
              ? "You haven't created any tour listings yet." 
              : `No listings with status "${filterStatus}" found.`}
          </p>
          <Link
            href="/dashboard/create-tour"
            className="bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Your First Tour
          </Link>
        </div>
      )}
    </div>
  );
}

