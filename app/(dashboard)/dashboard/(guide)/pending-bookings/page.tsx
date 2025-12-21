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
        <div className="overflow-x-auto bg-white rounded-lg shadow border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tour
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isGuide ? 'Tourist' : 'Guide'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingBookings.map((booking: any) => {
                const tour = booking.tourId || {};
                const user = isGuide ? (booking.userId || {}) : (booking.guideId || {});
                const payment = booking.payment || {};
                const paymentStatus = payment.status || 'UNPAID';
                
                return (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-lg object-cover" 
                            src={tour.images?.[0] || 'https://via.placeholder.com/40x40'} 
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
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img 
                            className="h-8 w-8 rounded-full object-cover" 
                            src={user.image || 'https://via.placeholder.com/32x32'} 
                            alt={user.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          {user.email && <div className="text-xs text-gray-500">{user.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">{booking.bookingTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${booking.totalAmount}</div>
                      <div className="text-xs text-gray-500">{booking.numberOfGuests} Guests</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-max ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-max ${getPaymentStatusColor(paymentStatus)}`}>
                          {paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <div className="flex justify-end gap-2">
                          <Link
                            href={`/tours/${tour.slug || tour._id}`}
                            className="text-[#1FB67A] hover:text-[#1dd489] text-sm font-medium px-2 py-1"
                          >
                            View
                          </Link>
                          {isGuide && booking.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleAcceptBooking(booking._id)}
                                disabled={isUpdating}
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50 px-2 py-1"
                                title="Accept"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeclineBooking(booking._id)}
                                disabled={isUpdating}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50 px-2 py-1"
                                title="Decline"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
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
    </div>
  );
}
