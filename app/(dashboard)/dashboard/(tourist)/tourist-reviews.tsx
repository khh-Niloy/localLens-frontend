'use client';

import React, { useState } from 'react';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useGetUserReviewsQuery } from '@/redux/features/review/review.api';
import ReviewCard from '@/components/Review/ReviewCard';
import ReviewModal from '@/components/Review/ReviewModal';
import { MessageSquare, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function TouristReviews() {
  const { data: meData } = useGetMeQuery(undefined);
  const me = meData as any;
  const { data: reviewsData, isLoading } = useGetUserReviewsQuery(
    { userId: me?._id, limit: 50 },
    { skip: !me?._id }
  );

  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-blue-50 border-t-[#4088FD] animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Gathering your stories...</p>
      </div>
    );
  }

  const reviews = reviewsData?.reviews || [];

  return (
    <div className="p-8 max-w-7xl mx-auto text-gray-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
           <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
              <Star className="w-5 h-5 fill-[#4088FD]" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">My Reviews</h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium ml-1"
          >
            A collection of your shared experiences and feedback.
          </motion.p>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {reviews.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] border border-dashed border-gray-200 p-24 text-center"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-[#4088FD]">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No Reviews Shared</h3>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed">
              You haven't shared any of your travel stories yet. Your feedback helps our community grow!
            </p>
            <Link
              href="/dashboard/my-trips"
              className="inline-flex items-center px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-[#4088FD] transition-all shadow-xl shadow-gray-100"
            >
              Share a Memory
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {reviews.map((review: any, index: number) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ReviewCard
                  review={review}
                  type="given"
                  onEdit={(rev) => {
                    setSelectedReview(rev);
                    setIsModalOpen(true);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedReview && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedReview(null);
          }}
          booking={{
            _id: selectedReview.bookingId,
            tourId: selectedReview.tourId,
            guideId: selectedReview.guideId,
          }}
          existingReview={selectedReview}
        />
      )}
    </div>
  );
}
