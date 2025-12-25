'use client';

import React from 'react';
import { Calendar, MapPin, Clock, Users, Phone, Mail, DollarSign, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useGetTouristMyToursQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useGetUserReviewsQuery } from '@/redux/features/review/review.api';
import ReviewModal from '@/components/Review/ReviewModal';
import { useState } from 'react';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'FAILED';
type PaymentStatus = 'PAID' | 'UNPAID' | 'CANCELLED' | 'FAILED' | 'REFUNDED';

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'FAILED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: PaymentStatus | string) => {
  switch (status) {
    case 'PAID':
      return 'text-green-600 bg-green-50';
    case 'UNPAID':
      return 'text-yellow-600 bg-yellow-50';
    case 'CANCELLED':
      return 'text-red-600 bg-red-50';
    case 'FAILED':
      return 'text-red-600 bg-red-50';
    case 'REFUNDED':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

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

  const allBookings = bookingsData?.data || [];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4088FD]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Failed to load trips. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Completed Tours</h1>
        <p className="text-gray-600">View your successfully completed tour experiences</p>
      </div>

      {allBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No completed tours
          </h3>
          <p className="text-gray-500 mb-6">
            You don't have any completed trips yet.
          </p>
          <Link
            href="/explore-tours"
            className="inline-block bg-[#4088FD] text-white px-6 py-2 rounded-md hover:bg-[#357ae8] transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
               <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tour
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guide
                </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allBookings.map((booking: any) => {
                const tour = booking.tourId || {};
                const guide = booking.guideId || {};
                const payment = booking.payment || {};
                const paymentStatus = payment.status || 'UNPAID';
                
                return (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-lg object-cover" 
                            src={tour.images?.[0] || 'https://via.placeholder.com/300x200'} 
                            alt={tour.title} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={tour.title}>
                            {tour.title}
                          </div>
                          <div className="text-xs text-gray-500">{tour.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-900">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                       <div className="text-xs text-gray-500">{booking.bookingTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-bold text-gray-900">${booking.totalAmount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img 
                            className="h-8 w-8 rounded-full object-cover" 
                            src={guide.image || 'https://via.placeholder.com/32x32'} 
                            alt={guide.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{guide.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(paymentStatus)}`}>
                        {paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex flex-col items-end gap-2">
                        <Link
                            href={`/tours/${typeof tour === 'object' ? (tour.slug || tour._id) : tour}`}
                            className="text-[#4088FD] hover:text-[#357ae8] font-medium"
                        >
                            View Details
                        </Link>
                        {booking.status === 'COMPLETED' && (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setExistingReview(userReviews?.reviews?.find((r: any) => r.bookingId === booking._id));
                              setIsModalOpen(true);
                            }}
                            className="text-white bg-[#4088FD] hover:bg-[#357ae8] px-3 py-1 rounded text-xs transition-colors"
                          >
                            {userReviews?.reviews?.some((r: any) => r.bookingId === booking._id) ? 'Edit Feedback' : 'Give Feedback'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
