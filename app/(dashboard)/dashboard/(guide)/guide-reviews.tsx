'use client';

import React from 'react';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useGetGuideReviewsQuery } from '@/redux/features/review/review.api';
import ReviewCard from '@/components/Review/ReviewCard';
import { MessageSquare, Star, Award } from 'lucide-react';

export default function GuideReviews() {
  const { data: meData } = useGetMeQuery(undefined);
  const me = meData as any;
  const { data: reviewsData, isLoading } = useGetGuideReviewsQuery(
    { guideId: me?._id, page: 1, limit: 50 },
    { skip: !me?._id }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4088FD]"></div>
      </div>
    );
  }

  const reviews = reviewsData?.reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Feedback</h1>
          <p className="text-gray-600">Reviews and ratings from your tourists</p>
        </div>
        
        {reviews.length > 0 && (
          <div className="flex items-center gap-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Overall Rating</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-100"></div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Reviews</span>
              <span className="text-2xl font-bold text-gray-900">{reviews.length}</span>
            </div>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Award className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500">Wait for your first completed tour feedback!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review: any) => (
            <ReviewCard
              key={review._id}
              review={review}
              type="received"
            />
          ))}
        </div>
      )}
    </div>
  );
}
