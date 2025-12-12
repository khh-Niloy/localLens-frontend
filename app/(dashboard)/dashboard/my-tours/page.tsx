'use client';

import React from 'react';
import { useGetMyToursQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import Link from 'next/link';

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

export default function MyToursPage() {
  const { data: myToursData, isLoading: toursLoading, error: toursError } = useGetMyToursQuery({});
  const { data: userData } = useGetMeQuery({});
  
  const tours: Tour[] = myToursData?.data || [];
  const userRole = userData?.role;
  
  // Calculate stats
  const totalTours = tours.length;
  const activeTours = tours.filter(tour => tour.status === 'ACTIVE').length;

  if (toursLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow border">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
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
        <h1 className="text-2xl font-bold text-gray-900">
          {userRole === 'GUIDE' ? 'My Tours' : userRole === 'TOURIST' ? 'My Bookings' : 'All Tours'}
        </h1>
        <p className="text-gray-600">
          {userRole === 'GUIDE' 
            ? 'Manage your tour listings and bookings' 
            : userRole === 'TOURIST'
            ? 'View your booked tours and travel history'
            : 'Manage all tours in the system'
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {userRole === 'GUIDE' ? 'Total Tours' : userRole === 'TOURIST' ? 'Total Bookings' : 'Total Tours'}
          </h3>
          <p className="text-3xl font-bold text-[#1FB67A]">{totalTours}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {userRole === 'GUIDE' ? 'Active Tours' : userRole === 'TOURIST' ? 'Upcoming Tours' : 'Active Tours'}
          </h3>
          <p className="text-3xl font-bold text-blue-600">{activeTours}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {userRole === 'GUIDE' ? 'Your Tours' : userRole === 'TOURIST' ? 'Your Bookings' : 'All Tours'}
            </h2>
            {userRole === 'GUIDE' && (
              <Link 
                href="/dashboard/create-tour"
                className="bg-[#1FB67A] text-white px-4 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
              >
                Create New Tour
              </Link>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {tours.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {userRole === 'GUIDE' 
                  ? 'No tours created yet. Create your first tour to get started!' 
                  : userRole === 'TOURIST'
                  ? 'No bookings yet. Explore tours to book your first adventure!'
                  : 'No tours found in the system.'
                }
              </p>
              {userRole === 'GUIDE' && (
                <Link 
                  href="/dashboard/create-tour"
                  className="inline-block bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
                >
                  Create Your First Tour
                </Link>
              )}
              {userRole === 'TOURIST' && (
                <Link 
                  href="/explore-tours"
                  className="inline-block bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
                >
                  Explore Tours
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <div key={tour._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    {tour.images && tour.images[0] ? (
                      <img 
                        src={tour.images[0]} 
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tour.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tour.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{tour.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                      <span>{tour.location}</span>
                      <span>Max {tour.maxGroupSize} guests</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#1FB67A]">${tour.tourFee}</span>
                      <div className="flex gap-2">
                        {userRole === 'GUIDE' && (
                          <>
                            <Link 
                              href={`/dashboard/edit-tour/${tour._id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </Link>
                            <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                          </>
                        )}
                                  <Link
                                    href={`/tours/${tour.slug || tour._id}`}
                                    className="text-[#1FB67A] hover:text-[#1dd489] text-sm font-medium"
                                  >
                                    View Details
                                  </Link>
                      </div>
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

