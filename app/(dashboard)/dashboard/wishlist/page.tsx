'use client';

import React from 'react';
import { Heart, MapPin, Clock, Users, Star, Calendar, Trash2 } from 'lucide-react';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/redux/features/wishlist/wishlist.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import WishlistButton from '@/components/ui/WishlistButton';
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600">Tours and experiences you want to book</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1FB67A]"></div>
        </div>
      )}

      {!!error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">Failed to load wishlist. Please try again.</p>
        </div>
      )}

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">{wishlistItems.length} tour{wishlistItems.length !== 1 ? 's' : ''} in your wishlist</p>
            <div className="text-sm text-gray-500">
              Sorted by date added (newest first)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item: any) => {
              // Handle both real API data and mock data structure
              const tour = item.tourId || item;
              const itemId = item._id || item.id;
              const tourId = tour._id || tour.tourId || item.tourId;
              
              return (
              <div key={itemId} className="bg-white rounded-lg shadow border overflow-hidden hover:shadow-lg transition-shadow">
                {/* Tour Image */}
                <div className="relative">
                  <img 
                    src={tour.images?.[0] || tour.image || 'https://via.placeholder.com/300x200'} 
                    alt={tour.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(tourId)}
                    className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  </button>
                  <div className="absolute top-3 left-3">
                    {getAvailabilityBadge(tour.availability || tour.status?.toLowerCase())}
                  </div>
                </div>

                {/* Tour Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{tour.title}</h3>
                  </div>

                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{tour.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{tour.maxDuration || tour.duration}h</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>Max {tour.maxGroupSize}</span>
                    </div>
                  </div>

                  {/* Guide Info */}
                  <div className="flex items-center mb-3">
                    <img 
                      src={tour.guideId?.image || tour.guide?.image || 'https://via.placeholder.com/24x24'} 
                      alt={tour.guideId?.name || tour.guide?.name || 'Guide'}
                      className="w-6 h-6 rounded-full object-cover mr-2"
                    />
                    <span className="text-xs text-gray-600">{tour.guideId?.name || tour.guide?.name || 'Local Guide'}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{tour.rating || 4.8}</span>
                      <span className="text-xs text-gray-500 ml-1">({tour.reviewCount || 0})</span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900">${tour.tourFee || tour.price}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    Added {new Date(item.addedAt || item.addedDate || new Date()).toLocaleDateString()}
                  </div>

                  {/* Simple Action Buttons */}
                  <div className="mt-4 space-y-2">
                              <Link
                                href={`/tours/${tour.slug || tourId}`}
                                className="block w-full text-center px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] transition-colors text-sm"
                              >
                                View Details
                              </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(tourId)}
                      disabled={isRemoving}
                      className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isRemoving ? 'Removing...' : 'Remove from Wishlist'}
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Simple Call to Action */}
          <div className="text-center mt-8">
            <Link 
              href="/explore-tours"
              className="inline-block bg-[#1FB67A] text-white px-8 py-3 rounded-lg hover:bg-[#1dd489] transition-colors font-medium"
            >
              Discover More Tours
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
