'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Star, Download, MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { useGetMyBookingsQuery, useInitiatePaymentMutation } from '@/redux/features/booking/booking.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useCreateReviewMutation, useGetUserReviewsQuery } from '@/redux/features/review/review.api';
import { toast } from 'react-hot-toast';

export default function PastBookingsPage() {
  const { data: userData } = useGetMeQuery({});
  const { data: bookingsData, isLoading, error } = useGetMyBookingsQuery({}, { 
    skip: !userData || userData.role !== 'TOURIST' 
  });
  const [initiatePayment, { isLoading: isInitiatingPayment }] = useInitiatePaymentMutation();
  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();
  const { data: reviewsData } = useGetUserReviewsQuery(
    { userId: userData?._id || '', page: 1, limit: 100 },
    { skip: !userData?._id }
  );

  // Filter for past bookings (COMPLETED, CANCELLED status or past dates)
  const today = new Date().toISOString().split('T')[0];
  const allBookings = bookingsData?.data || [];
  const pastBookings = allBookings.filter((booking: any) => {
    const bookingDate = booking.bookingDate || booking.createdAt;
    const isPast = bookingDate < today;
    const isCompleted = booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.status === 'FAILED';
    return isPast || isCompleted;
  });
  
  const reviews = reviewsData?.data?.reviews || [];
  const reviewsByBookingId = new Map(reviews.map((r: any) => [r.bookingId?._id || r.bookingId, r]));
  
  const [ratingModal, setRatingModal] = useState<{ bookingId: string; tourId: string; guideId: string } | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleRateExperience = (booking: any) => {
    setRatingModal({
      bookingId: booking._id,
      tourId: booking.tourId?._id || booking.tourId,
      guideId: booking.guideId?._id || booking.guideId,
    });
    setSelectedRating(0);
    setReviewText('');
  };

  const submitRating = async () => {
    if (!ratingModal || selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await createReview({
        bookingId: ratingModal.bookingId,
        tourId: ratingModal.tourId,
        guideId: ratingModal.guideId,
        rating: selectedRating,
        comment: reviewText || 'No comment provided',
      }).unwrap();
      
      toast.success('Thank you for your review!');
      setRatingModal(null);
      setSelectedRating(0);
      setReviewText('');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to submit review. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1FB67A]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Failed to load bookings. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Past Bookings</h1>
        <p className="text-gray-600">Your completed tours and experiences</p>
      </div>

      {pastBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No past bookings</h3>
          <p className="text-gray-500 mb-6">You haven't completed any tours yet.</p>
          <Link 
            href="/explore-tours"
            className="inline-block bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pastBookings.map((booking: any) => {
            const tour = booking.tourId || {};
            const guide = booking.guideId || {};
            const payment = booking.payment || {};
            
            return (
              <div key={booking._id} className="bg-white rounded-lg shadow border overflow-hidden">
                <div className="md:flex">
                  {/* Tour Image */}
                  <div className="md:w-1/3">
                    <img 
                      src={tour.images?.[0] || 'https://via.placeholder.com/300x200'} 
                      alt={tour.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  
                  {/* Booking Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{tour.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Completed on {new Date(booking.bookingDate || booking.updatedAt).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{booking.bookingTime} • {tour.maxDuration || 'N/A'} hours</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{tour.location || 'Location TBD'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-700">${booking.totalAmount || 0}</div>
                        <div className="text-sm text-gray-500">Booking #{booking._id.slice(-6)}</div>
                        <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                          booking.status === 'COMPLETED' 
                            ? 'bg-blue-100 text-blue-800'
                            : booking.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {/* Guide Information */}
                    {guide && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Your Guide</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img 
                              src={guide.image || 'https://via.placeholder.com/48x48'} 
                              alt={guide.name}
                              className="w-12 h-12 rounded-full object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{guide.name}</p>
                              {guide.email && (
                                <div className="flex items-center">
                                  <Mail className="w-3 h-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-600">{guide.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">{booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Status */}
                    {payment && (
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Payment Status:</span>
                          <span className={`font-medium ${
                            payment.status === 'PAID' 
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div className="flex space-x-3">
                        <Link
                          href={`/tours/${tour.slug || tour._id}`}
                          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          View Tour Details
                        </Link>
                      </div>
                      <div className="space-x-3">
                        {booking.status === 'COMPLETED' && payment && payment.status === 'UNPAID' && (
                          <button 
                            onClick={async () => {
                              try {
                                const result = await initiatePayment(booking._id).unwrap();
                                if (result.data?.paymentUrl) {
                                  window.location.href = result.data.paymentUrl;
                                }
                              } catch (error: any) {
                                toast.error(error?.data?.message || 'Failed to initiate payment');
                              }
                            }}
                            disabled={isInitiatingPayment}
                            className="px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] text-sm disabled:opacity-50"
                          >
                            {isInitiatingPayment ? 'Processing...' : 'Pay Now'}
                          </button>
                        )}
                        {booking.status === 'COMPLETED' && (!payment || payment.status === 'PAID') && (
                          reviewsByBookingId.has(booking._id) ? (
                            <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm">
                              Already Reviewed
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleRateExperience(booking)}
                              className="px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] text-sm"
                            >
                              Rate Experience
                            </button>
                          )
                        )}
                        {booking.status === 'CANCELLED' && (
                          <Link
                            href={`/tours/${tour.slug || tour._id}`}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                          >
                            Book Again
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">How was your tour experience?</p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= selectedRating ? 'text-yellow-400 fill-current' : 'text-gray-300'} hover:text-yellow-400 transition-colors`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write a review <span className="text-gray-500">(required)</span>
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1FB67A] focus:border-transparent"
                placeholder="Share your experience with other travelers..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setRatingModal(null)}
                disabled={isSubmittingReview}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={selectedRating === 0 || !reviewText.trim() || isSubmittingReview}
                className="flex-1 px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
