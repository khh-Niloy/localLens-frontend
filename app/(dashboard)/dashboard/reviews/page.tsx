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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-blue-50 border-t-[#4088FD] animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Synchronizing reviews...</p>
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
