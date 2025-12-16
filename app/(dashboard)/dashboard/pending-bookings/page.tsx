'use client';

import React from 'react';
import { Calendar, MapPin, Clock, Users, Phone, Mail, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useGetPendingBookingsQuery, useGetMyBookingsQuery, useUpdateBookingStatusMutation } from '@/redux/features/booking/booking.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

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

export default function PendingBookingsPage() {
  const { data: userData } = useGetMeQuery({});
  const isGuide = userData?.role === 'GUIDE';
  const isTourist = userData?.role === 'TOURIST';
  
  // For guides: Get pending bookings from guide endpoint
  const { data: guideBookingsData, isLoading: isLoadingGuide, error: errorGuide } = useGetPendingBookingsQuery({}, { 
    skip: !isGuide 
  });
  
  // For tourists: Get all bookings and filter for PENDING status
  const { data: touristBookingsData, isLoading: isLoadingTourist, error: errorTourist } = useGetMyBookingsQuery({}, { 
    skip: !isTourist 
  });
  
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const isLoading = isGuide ? isLoadingGuide : isLoadingTourist;
  const error = isGuide ? errorGuide : errorTourist;
  
  // Get pending bookings based on role
  const pendingBookings = isGuide
    ? (guideBookingsData?.data || [])
    : (touristBookingsData?.data || []).filter((booking: any) => booking.status === 'PENDING');

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus({ id: bookingId, status: 'CONFIRMED' }).unwrap();
      toast.success('Booking confirmed successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to confirm booking');
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to decline this booking?')) {
      return;
    }

    try {
      await updateBookingStatus({ id: bookingId, status: 'CANCELLED' }).unwrap();
      toast.success('Booking declined');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to decline booking');
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus({ id: bookingId, status: 'COMPLETED' }).unwrap();
      toast.success('Booking marked as completed!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to complete booking');
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
        <h1 className="text-2xl font-bold text-gray-900">Pending Bookings</h1>
        <p className="text-gray-600">
          {isGuide 
            ? 'Review and manage pending booking requests' 
            : 'Your pending booking requests waiting for guide approval'}
        </p>
      </div>

      {pendingBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            {isGuide 
              ? "You don't have any pending booking requests at the moment."
              : "You don't have any pending booking requests waiting for approval."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingBookings.map((booking: any) => {
            const tour = booking.tourId || {};
            const user = isGuide ? (booking.userId || {}) : (booking.guideId || {});
            const payment = booking.payment || {};
            const paymentStatus = payment.status || 'UNPAID';
            
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
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{tour.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(booking.bookingDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{booking.bookingTime} • {tour.maxDuration || 'N/A'} hours</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{tour.location || 'Location TBD'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-[#1FB67A] mb-2">${booking.totalAmount || 0}</div>
                        <div className="text-xs text-gray-500 mb-2">Booking #{booking._id.slice(-6)}</div>
                        <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {/* Status and Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Booking Status</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Payment Status</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(paymentStatus)}`}>
                          {paymentStatus}
                        </div>
                        {payment.transactionId && (
                          <div className="text-xs text-gray-500 mt-1">
                            Txn: {payment.transactionId}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* User Information (Guide sees Tourist, Tourist sees Guide) */}
                    {user && (
                      <div className="border-t pt-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          {isGuide ? 'Tourist Information' : 'Guide Information'}
                        </h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img 
                              src={user.image || 'https://via.placeholder.com/48x48'} 
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              {user.email && (
                                <div className="flex items-center text-xs text-gray-600">
                                  <Mail className="w-3 h-3 mr-1" />
                                  <span>{user.email}</span>
                                </div>
                              )}
                              {user.phone && (
                                <div className="flex items-center text-xs text-gray-600">
                                  <Phone className="w-3 h-3 mr-1" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">{booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}</span>
                            </div>
                            {isGuide && (
                              <div className="flex space-x-2">
                                {user.phone && (
                                  <a 
                                    href={`tel:${user.phone}`}
                                    className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                                    title="Call tourist"
                                  >
                                    <Phone className="w-4 h-4" />
                                  </a>
                                )}
                                {user.email && (
                                  <a 
                                    href={`mailto:${user.email}`}
                                    className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                                    title="Email tourist"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            )}
                            {isTourist && (
                              <div className="flex space-x-2">
                                {user.phone && (
                                  <a 
                                    href={`tel:${user.phone}`}
                                    className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                                    title="Call guide"
                                  >
                                    <Phone className="w-4 h-4" />
                                  </a>
                                )}
                                {user.email && (
                                  <a 
                                    href={`mailto:${user.email}`}
                                    className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                                    title="Email guide"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Booking Info */}
                    <div className="border-t pt-4 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <span className="ml-2 text-gray-900">
                            {new Date(booking.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                          <div>
                            <span className="text-gray-500">Last Updated:</span>
                            <span className="ml-2 text-gray-900">
                              {new Date(booking.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <Link
                        href={`/tours/${tour.slug || tour._id}`}
                        className="text-[#1FB67A] hover:text-[#1dd489] text-sm font-medium"
                      >
                        View Tour Details
                      </Link>
                      {isGuide && (
                        <div className="flex space-x-3">
                          {booking.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleDeclineBooking(booking._id)}
                                disabled={isUpdating}
                                className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Decline
                              </button>
                              <button
                                onClick={() => handleAcceptBooking(booking._id)}
                                disabled={isUpdating}
                                className="flex items-center px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] transition-colors text-sm disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {isUpdating ? 'Processing...' : 'Accept Booking'}
                              </button>
                            </>
                          )}
                          {booking.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleCompleteBooking(booking._id)}
                              disabled={isUpdating}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {isUpdating ? 'Processing...' : 'Mark as Completed'}
                            </button>
                          )}
                          {booking.status === 'COMPLETED' && paymentStatus === 'PAID' && (
                            <div className="flex items-center text-green-600 text-sm">
                              <DollarSign className="w-4 h-4 mr-1" />
                              <span>Payment Received</span>
                            </div>
                          )}
                          {booking.status === 'COMPLETED' && paymentStatus === 'UNPAID' && (
                            <div className="flex items-center text-yellow-600 text-sm">
                              <DollarSign className="w-4 h-4 mr-1" />
                              <span>Awaiting Payment</span>
                            </div>
                          )}
                        </div>
                      )}
                      {isTourist && (
                        <div className="text-sm text-gray-600">
                          Waiting for guide approval
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
