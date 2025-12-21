'use client';

import React from 'react';
import { useGetGuideMyToursQuery } from '@/redux/features/tour/tour.api';
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
  slug?: string;
}

export default function MyToursPage() {
  const { data: userData } = useGetMeQuery({});
  const userRole = userData?.role;

  const { data: guideToursData, isLoading: guideToursLoading, error: guideToursError } = useGetGuideMyToursQuery(undefined, {
    skip: userRole !== 'GUIDE'
  });
  
  const tours: any[] = userRole === 'GUIDE' 
    ? (guideToursData?.data || []) 
    : [];
  
  const isLoading = userRole === 'GUIDE' ? guideToursLoading : false;
  const error = userRole === 'GUIDE' ? guideToursError : null;
  
  // Calculate stats
  const totalTours = tours.length;
  const activeTours = tours.filter(tour => tour.status === 'ACTIVE').length;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
           <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
           <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="h-16 bg-gray-200 rounded w-full"></div>
             ))}
           </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error loading tours</h3>
          <p className="text-red-600 text-sm mt-1">
            {(error as any)?.data?.message || 'Failed to load tours. Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {userRole === 'GUIDE' ? 'My Tours' : 'All Tours'}
        </h1>
        <p className="text-gray-600">
          {userRole === 'GUIDE' 
            ? 'Manage your tour listings' 
            : 'Manage all tours in the system'
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Tours</h3>
          <p className="text-3xl font-bold text-[#1FB67A]">{totalTours}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Tours</h3>
          <p className="text-3xl font-bold text-blue-600">{activeTours}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {userRole === 'GUIDE' ? 'Your Tours' : 'All Tours'}
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
        
        {tours.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">
              {userRole === 'GUIDE' 
                ? 'No tours created yet. Create your first tour to get started!' 
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
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Tour
                   </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Status
                   </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Price
                   </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Guests
                   </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Location
                   </th>
                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Actions
                   </th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {tours.map((tour) => (
                   <tr key={tour._id} className="hover:bg-gray-50">
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center">
                         <div className="flex-shrink-0 h-10 w-10">
                           {tour.images && tour.images[0] ? (
                             <img 
                               className="h-10 w-10 rounded-lg object-cover" 
                               src={tour.images[0]} 
                               alt={tour.title} 
                             />
                           ) : (
                             <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                               No Img
                             </div>
                           )}
                         </div>
                         <div className="ml-4">
                           <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={tour.title}>
                             {tour.title}
                           </div>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                         tour.status === 'ACTIVE' 
                           ? 'bg-green-100 text-green-800' 
                           : 'bg-gray-100 text-gray-800'
                       }`}>
                         {tour.status}
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       ${tour.tourFee}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       Max {tour.maxGroupSize}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {tour.location}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <div className="flex justify-end gap-3">
                         {userRole === 'GUIDE' && (
                            <>
                              <Link 
                                href={`/dashboard/edit-tour/${tour._id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </Link>
                              <button className="text-red-600 hover:text-red-900">
                                Delete
                              </button>
                            </>
                          )}
                          <Link
                            href={`/tours/${tour.slug || tour._id}`}
                            className="text-[#1FB67A] hover:text-[#1dd489]"
                          >
                            View
                          </Link>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}
