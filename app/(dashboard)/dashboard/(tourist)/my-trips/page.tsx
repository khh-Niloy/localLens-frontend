'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Star, MessageSquare, ChevronRight, History } from 'lucide-react';
import Link from 'next/link';
import { useGetTouristMyToursQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useGetUserReviewsQuery } from '@/redux/features/review/review.api';
import ReviewModal from '@/components/Review/ReviewModal';

export default function MyTripsPage() {
  const { data: userData } = useGetMeQuery({});
  const { data: bookingsData, isLoading, error } = useGetTouristMyToursQuery(undefined, { 
    skip: !userData || userData.role !== 'TOURIST' 
  });
  
  const { data: userReviews } = useGetUserReviewsQuery(
    { userId: userData?._id as string, limit: 100 },
    { skip: !userData?._id }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [existingReview, setExistingReview] = useState<any>(null);

  const allBookings = bookingsData || [];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-50 border-t-emerald-500 animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Reliving your memories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center max-w-lg mx-auto">
          <p className="text-rose-600 font-bold">Failed to load your trip history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Passport Memories</h1>
          </div>
          <p className="text-gray-500 font-medium ml-1">A collection of your successfully completed journeys.</p>
        </div>

        <div className="px-5 py-3 bg-emerald-50 rounded-xl flex items-center gap-3 border border-emerald-100">
          <div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">Total Trips</span>
            <span className="text-xl font-black text-emerald-700">{allBookings.length}</span>
          </div>
        </div>
      </div>

      {allBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Your Map is Empty</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium mb-6">You haven't completed any tours yet.</p>
          <Link href="/explore-tours" className="inline-flex items-center px-8 py-3 bg-[#4088FD] text-white rounded-xl font-black hover:bg-blue-600 transition-all">
            Explore Experiences
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tour</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Guide</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allBookings.map((booking: any) => {
                  const tour = booking.tourId || {};
                  const guide = booking.guideId || {};
                  const hasReviewed = userReviews?.reviews?.some((r: any) => r.bookingId === booking._id);
                  
                  return (
                    <tr key={booking._id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img className="w-12 h-12 rounded-xl object-cover" src={tour.images?.[0] || 'https://via.placeholder.com/48'} alt={tour.title} />
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 truncate max-w-[200px]">{tour.title}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {tour.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-sm">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img className="w-9 h-9 rounded-full object-cover" src={guide.image || 'https://via.placeholder.com/36'} alt={guide.name} />
                          <div className="font-bold text-gray-900 text-sm">{guide.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-gray-900">{booking.totalAmount} TK</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link href={`/tours/${tour._id}`} className="text-gray-400 hover:text-[#4088FD] font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                            Details <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setExistingReview(userReviews?.reviews?.find((r: any) => r.bookingId === booking._id));
                              setIsModalOpen(true);
                            }}
                            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all inline-flex items-center gap-1.5 ${
                              hasReviewed 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-[#4088FD] text-white'
                            }`}
                          >
                            {hasReviewed ? <Star className="w-3.5 h-3.5 fill-emerald-600" /> : <MessageSquare className="w-3.5 h-3.5" />}
                            {hasReviewed ? 'Shared' : 'Feedback'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedBooking && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
            setExistingReview(null);
          }}
          booking={selectedBooking}
          existingReview={existingReview}
        />
      )}
    </div>
  );
}
