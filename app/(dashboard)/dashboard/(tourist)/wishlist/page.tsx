'use client';

import React from 'react';
import { Heart, MapPin, Clock, Users, Star, Trash2 } from 'lucide-react';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/redux/features/wishlist/wishlist.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function WishlistPage() {
  const { data: userData } = useGetMeQuery({});
  const { data: wishlistData, isLoading, error } = useGetWishlistQuery({}, { skip: !userData || userData.role !== 'TOURIST' });
  const [removeFromWishlistMutation, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

  const wishlistItems = wishlistData?.data || [];

  const handleRemoveFromWishlist = async (tourId: string) => {
    try {
      await removeFromWishlistMutation(tourId).unwrap();
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to remove from wishlist');
    }
  };

  const getAvailabilityBadge = (availability: string | undefined) => {
    if (!availability) return null;
    
    switch (availability.toLowerCase()) {
      case 'available':
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Available</span>;
      case 'limited':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Limited</span>;
      case 'unavailable':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Unavailable</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{availability}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1FB67A]"></div>
        </div>
      </div>
    );
  }

  if (!!error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{(error as any)?.data?.message || 'Failed to load wishlist. Please try again.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600">Tours and experiences you want to book</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-dashed border-gray-300">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Start adding tours you're interested in to your wishlist.</p>
          <Link 
            href="/explore-tours"
            className="inline-block bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guide
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wishlistItems.map((item: any) => {
                  const tour = item.tourId || item;
                  const itemId = item._id || item.id;
                  const tourId = tour._id || tour.tourId || item.tourId;

                  return (
                    <tr key={itemId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-24 relative">
                            <img 
                              className="h-16 w-24 rounded object-cover" 
                              src={tour.images?.[0] || tour.image || 'https://via.placeholder.com/300x200'}
                              alt={tour.title}
                            />
                             <div className="absolute top-0 right-0 -mr-1 -mt-1">
                               {getAvailabilityBadge(tour.availability || tour.status)}
                             </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1" title={tour.title}>
                              {tour.title}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {tour.maxDuration || tour.duration}h
                              <span className="mx-1">•</span>
                              <Users className="w-3 h-3 mr-1" />
                              Max {tour.maxGroupSize}
                            </div>
                             <div className="text-xs text-gray-400 mt-1">
                                Added {new Date(item.addedAt || item.addedDate || new Date()).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                           <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                           {tour.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center">
                            <img 
                              className="h-6 w-6 rounded-full object-cover mr-2" 
                              src={tour.guideId?.image || tour.guide?.image || 'https://via.placeholder.com/24x24'}
                              alt={tour.guideId?.name}
                            />
                            <div className="text-sm text-gray-900">{tour.guideId?.name || tour.guide?.name || 'Local Guide'}</div>
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">${tour.tourFee || tour.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          {tour.rating || 4.8}
                          <span className="text-xs text-gray-500 ml-1">({tour.reviewCount || 0})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2 items-center">
                           <Link
                              href={`/tours/${tour.slug || tourId}`}
                              className="text-[#1FB67A] hover:text-[#1dd489] font-medium"
                            >
                              View
                           </Link>
                           <button
                            onClick={() => handleRemoveFromWishlist(tourId)}
                            disabled={isRemoving}
                            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
