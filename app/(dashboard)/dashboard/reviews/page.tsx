'use client';

import React from 'react';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import TouristReviews from '../(tourist)/tourist-reviews';
import GuideReviews from '../(guide)/guide-reviews';

export default function ReviewsPage() {
  const { data: meData, isLoading } = useGetMeQuery(undefined);
  const me = meData as any;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1FB67A]"></div>
      </div>
    );
  }

  if (me?.role === 'TOURIST') {
    return <TouristReviews />;
  }

  if (me?.role === 'GUIDE') {
    return <GuideReviews />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Reviews</h1>
      <p>Please log in as a tourist or guide to see your reviews.</p>
    </div>
  );
}
