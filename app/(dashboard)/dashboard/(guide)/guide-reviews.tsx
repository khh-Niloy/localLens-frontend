'use client';

import React from 'react';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useGetGuideReviewsQuery } from '@/redux/features/review/review.api';
import ReviewCard from '@/components/Review/ReviewCard';
import { MessageSquare, Star, Award, TrendingUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GuideReviews() {
  const { data: meData } = useGetMeQuery(undefined);
  const me = meData as any;
  const { data: reviewsData, isLoading } = useGetGuideReviewsQuery(
    { guideId: me?._id, page: 1, limit: 50 },
    { skip: !me?._id }
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-blue-50 border-t-[#4088FD] animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Loading feedback...</p>
      </div>
    );
  }

  const reviews = reviewsData?.reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviews.length 
    : 0;

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
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Reputation Dashboard</h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium ml-1"
          >
            Reviews and satisfaction metrics from your past travelers.
          </motion.p>
        </div>
        
        {reviews.length > 0 && (
          <div className="flex flex-wrap gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[180px]"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-500">
                <Star className="w-5 h-5 fill-yellow-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Avg Rating</p>
                <p className="text-xl font-black text-gray-900">{averageRating.toFixed(1)}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[180px]"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Total Reviews</p>
                <p className="text-xl font-black text-gray-900">{reviews.length}</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {reviews.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-[#4088FD]">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">The Stage is Set</h3>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed">
              You haven't received any reviews yet. Every exceptional experience leads to a great story!
            </p>
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
                transition={{ delay: index * 0.05 }}
              >
                <ReviewCard
                  review={review}
                  type="received"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
