'use client';

import React, { useState } from 'react';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useGetUserReviewsQuery } from '@/redux/features/review/review.api';
import ReviewCard from '@/components/Review/ReviewCard';
import ReviewModal from '@/components/Review/ReviewModal';
import { MessageSquare, Star } from 'lucide-react';

export default function TouristReviews() {
  const { data: meData } = useGetMeQuery(undefined);
  const me = meData as any;
  const { data: reviewsData, isLoading } = useGetUserReviewsQuery(
    { userId: me?._id, page: 1, limit: 50 },
    { skip: !me?._id }
  );

  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1FB67A]"></div>
      </div>
    );
  }

  const reviews = reviewsData?.reviews || [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-gray-600">See all the reviews you've shared with our guides</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500">You haven't shared any experiences yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review: any) => (
            <ReviewCard
              key={review._id}
              review={review}
              type="given"
              onEdit={(rev) => {
                setSelectedReview(rev);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

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
