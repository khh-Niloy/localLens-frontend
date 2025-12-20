'use client';

import React from 'react';
import { MapPin, Eye, Star, DollarSign, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { useGetAllToursForAdminQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';

export default function AllListingsPage() {
  const { data: userData } = useGetMeQuery({});
  const { data: toursData, isLoading, error } = useGetAllToursForAdminQuery({}, {
    skip: !userData || userData.role !== 'ADMIN'
  });

  const listings = toursData?.data || [];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1FB67A]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Failed to load listings. Please try again.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
      case 'DEACTIVATE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalStats = {
    totalListings: listings.length,
    activeListings: listings.filter((l: any) => l.status === 'ACTIVE').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Listings</h1>
          <p className="text-gray-600">Manage all tour listings in the system</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Listings Grid */}
      <div className="space-y-4">
        {listings.length === 0 ? (
          <div className="bg-white rounded-lg shadow border p-12 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">There are no tour listings in the system yet.</p>
          </div>
        ) : (
          listings.map((listing: any) => (
            <div key={listing._id} className="bg-white rounded-lg shadow border p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="w-full lg:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden">
                    {listing.images?.[0] ? (
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{listing.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {listing.maxDuration || 'N/A'} hours
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Max {listing.maxGroupSize || 'N/A'} guests
                        </span>
                        <span>Category: {listing.category || 'N/A'}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusColor(listing.status)}`}>
                      {listing.status || 'N/A'}
                    </span>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-[#1FB67A]">${listing.tourFee || 0}</p>
                      <p className="text-xs text-gray-500">Price per person</p>
                    </div>
                    {listing.rating && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-bold">{listing.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">Created</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/tours/${listing.slug || listing._id}`}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

