'use client';

import React from 'react';
import { Star, Calendar } from 'lucide-react';
import Link from 'next/link';

interface ReviewCardProps {
  review: any;
  type: 'given' | 'received';
  onEdit?: (review: any) => void;
}

export default function ReviewCard({ review, type, onEdit }: ReviewCardProps) {
  const tour = review.tourId || {};
  const user = type === 'given' ? review.guideId : review.userId;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              src={user?.image || 'https://via.placeholder.com/40/40'}
              alt={user?.name}
              className="h-10 w-10 rounded-full object-cover border border-gray-200"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{user?.name}</h4>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-700 font-bold text-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{review.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-base font-bold text-[#4088FD] mb-2 line-clamp-1">{tour.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-4 italic bg-gray-50 p-3 rounded-lg">"{review.comment || 'No comment provided'}"</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 gap-2 mt-auto">
        <Link
          href={`/tours/${typeof tour === 'object' ? tour._id : tour}`}
          className="text-xs font-semibold text-gray-700 hover:text-[#4088FD] transition-colors flex items-center gap-1"
        >
          See Tour Details
        </Link>
        
        {type === 'given' && onEdit && (
          <button
            onClick={() => onEdit(review)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Edit Review
          </button>
        )}
      </div>
    </div>
  );
}
