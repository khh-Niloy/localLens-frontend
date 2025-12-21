'use client';

import React from 'react';
import { MapPin, Eye, Star, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { useGetAllToursForAdminQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';

export default function AllToursPage() {
  const { data: userData } = useGetMeQuery({});
  const { data: toursData, isLoading, error } = useGetAllToursForAdminQuery({}, {
    skip: !userData || userData.role !== 'ADMIN'
  });

  const tours = toursData?.data || [];

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
          <p className="text-red-800">Failed to load tours. Please try again.</p>
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
    totalTours: tours.length,
    activeTours: tours.filter((t: any) => t.status === 'ACTIVE').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Tours</h1>
          <p className="text-gray-600">Manage all tours in the system</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tours</p>
              <p className="text-xl font-bold text-gray-900">{totalStats.totalTours}</p>
            </div>
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-[#1FB67A]">{totalStats.activeTours}</p>
            </div>
            <Eye className="w-6 h-6 text-[#1FB67A]" />
          </div>
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700 w-[40%]">Tour Details</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Guide</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Price</th>
                <th className="text-right py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No tours found.
                  </td>
                </tr>
              ) : (
                tours.map((tour: any) => (
                  <tr key={tour._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          {tour.images?.[0] ? (
                            <img 
                              src={tour.images[0]} 
                              alt={tour.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <MapPin className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{tour.title}</h3>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">{tour.location}</span>
                          </div>
                          <div className="flex gap-3 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {tour.maxDuration}h
                            </span>
                            <span className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              Max {tour.maxGroupSize}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {tour.guideId && (
                        <div>
                          <p className="font-medium text-gray-900">{tour.guideId.name}</p>
                          <p className="text-xs text-gray-500">{tour.guideId.email}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(tour.status)}`}>
                        {tour.status?.toLowerCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#1FB67A]">${tour.tourFee}</div>
                      <div className="text-xs text-gray-500">per person</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/tours/${tour.slug || tour._id}`}
                        className="inline-flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                        title="View Tour"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
