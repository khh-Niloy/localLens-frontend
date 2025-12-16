'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetWishlistQuery } from '@/redux/features/wishlist/wishlist.api';
import { toast } from 'react-hot-toast';

interface WishlistButtonProps {
  tourId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function WishlistButton({ tourId, className = '', size = 'md' }: WishlistButtonProps) {
  const { data: userData } = useGetMeQuery({});
  const { data: wishlistData } = useGetWishlistQuery({}, { skip: !userData || userData.role !== 'TOURIST' });
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
  
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if tour is in wishlist
  useEffect(() => {
    if (wishlistData?.data) {
      const isInList = wishlistData.data.some((item: any) => item.tourId === tourId || item._id === tourId);
      setIsInWishlist(isInList);
    }
  }, [wishlistData, tourId]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userData) {
      toast.error('Please login to add tours to your wishlist');
      return;
    }

    if (userData.role !== 'TOURIST') {
      toast.error('Only tourists can add tours to wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(tourId).unwrap();
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(tourId).unwrap();
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong');
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={isAdding || isRemoving}
      className={`${buttonSizeClasses[size]} bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all disabled:opacity-50 ${className}`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={`${sizeClasses[size]} transition-colors ${
          isInWishlist 
            ? 'text-red-500 fill-current' 
            : 'text-gray-600 hover:text-red-500'
        }`} 
      />
    </button>
  );
}
