'use client';

import React from 'react';
import { useGetMyToursQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import Link from 'next/link';
import { Edit, Eye } from 'lucide-react';

interface Tour {
  _id: string;
  title: string;
  description: string;
  tourFee: number;
  status: string;
  images: string[];
  createdAt: string;
  maxGroupSize: number;
  location: string;
}

export default function EditTourListPage() {
  const { data: myToursData, isLoading: toursLoading, error: toursError } = useGetMyToursQuery({});
  const { data: userData } = useGetMeQuery({});
  
  const tours: Tour[] = myToursData?.data || [];
  const userRole = userData?.role;

  if (toursLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (toursError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error loading tours</h3>
          <p className="text-red-600 text-sm mt-1">
            {(toursError as any)?.data?.message || 'Failed to load tours. Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Tours</h1>
        <p className="text-gray-600">Select a tour to edit from your listings</p>
      </div>
      
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Your Tours</h2>
          <p className="text-sm text-gray-600 mt-1">Click on a tour to edit its details</p>
        </div>
        
        <div className="p-6">
          {tours.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No tours found to edit.</p>
              <Link 
                href="/dashboard/create-tour"
                className="inline-block bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
              >
                Create Your First Tour
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tours.map((tour) => (
                <div key={tour._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                        {tour.images && tour.images[0] ? (
                          <img 
                            src={tour.images[0]} 
                            alt={tour.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{tour.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-1">{tour.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{tour.location}</span>
                          <span>${tour.tourFee}</span>
                          <span>Max {tour.maxGroupSize} guests</span>
                          <span className={`px-2 py-1 rounded-full ${
                            tour.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {tour.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        href={`/dashboard/edit-tour/${tour._id}`}
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <Link 
                        href={`/dashboard/tour-details/${tour._id}`}
                        className="flex items-center gap-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}