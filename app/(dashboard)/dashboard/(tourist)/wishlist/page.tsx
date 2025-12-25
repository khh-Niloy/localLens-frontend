'use client';

import React from 'react';
import { Heart, Search, Loader2, Trash2 } from 'lucide-react';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/redux/features/wishlist/wishlist.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import TourCard from '@/components/TourCard';

export default function WishlistPage() {
  const { data: userData } = useGetMeQuery({});
  const { data: wishlistData, isLoading, error } = useGetWishlistQuery({}, { skip: !userData || userData.role !== 'TOURIST' });
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();

  const wishlistItems = wishlistData?.data || [];

  const handleRemoveFromWishlist = async (tourId: string) => {
    try {
      await removeFromWishlistMutation(tourId).unwrap();
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to remove from wishlist');
    }
  };

  // Mock onBook for TourCard
  const handleBook = () => {
    // Navigating to tour details usually happens via the card itself
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#4088FD] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center">
          <p className="text-red-600 font-bold">{(error as any)?.data?.message || 'Failed to load wishlist. Please try again.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-12">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-3 mb-2"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Saved Experiences</h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 font-medium ml-1"
        >
          {wishlistItems.length} adventures waiting for your next journey in Bangladesh.
        </motion.p>
      </div>

      <AnimatePresence mode="popLayout">
        {wishlistItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-24 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 shadow-blue-100/20"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 text-[#4088FD]" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Your Wishlist is Empty</h3>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed">
              Discover unique tours and save your favorites to plan the perfect trip!
            </p>
            <Link 
              href="/explore-tours"
              className="inline-flex items-center px-8 py-4 bg-[#4088FD] text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-100"
            >
              Start Exploring
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item: any, index: number) => {
              const tour = item.tourId || item;
              return (
                <motion.div
                  key={item._id || item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  <TourCard 
                    tour={tour} 
                    userData={userData}
                    onBook={handleBook}
                  />
                  {/* Remove Overlay Button for Wishlist context */}
                  <button
                    onClick={() => handleRemoveFromWishlist(tour._id || tour.id)}
                    className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
