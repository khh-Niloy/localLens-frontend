'use client';

import React from 'react';
import { Calendar, MapPin, Clock, Users, Star, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';
import { useGetPendingBookingsQuery, useUpdateBookingStatusMutation } from '@/redux/features/booking/booking.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function PendingBookingsPage() {
  const { data: userData } = useGetMeQuery({});
  const { data: bookingsData, isLoading, error } = useGetPendingBookingsQuery({}, { 
    skip: !userData || userData.role !== 'GUIDE' 
  });
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const pendingBookings = bookingsData?.data || [];

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
          <p className="text-red-800">Failed to load pending bookings. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Bookings</h1>
        <p className="text-gray-600">Review and manage booking requests from tourists</p>
      </div>

      {pendingBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending bookings</h3>
          <p className="text-gray-500 mb-6">You don't have any pending booking requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingBookings.map((booking: any) => {
            const tour = booking.tourId || {};
            const tourist = booking.userId || {};
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
                          <span>{new Date(booking.bookingDate).toLocaleDateString('en-US', { 
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
                        <div className="text-2xl font-bold text-[#1FB67A]">${booking.totalAmount || 0}</div>
                        <div className="text-sm text-gray-500">Booking #{booking._id.slice(-6)}</div>
                        <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          PENDING
                        </span>
                      </div>
                    </div>

                    {/* Tourist Information */}
                    {tourist && (
                      <div className="border-t pt-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Tourist Information</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img 
                              src={tourist.image || 'https://via.placeholder.com/48x48'} 
                              alt={tourist.name}
                              className="w-12 h-12 rounded-full object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{tourist.name}</p>
                              {tourist.email && (
                                <div className="flex items-center">
                                  <Mail className="w-3 h-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-600">{tourist.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">{booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}</span>
                            </div>
                            {tourist.phone && (
                              <div className="flex space-x-2">
                                <a 
                                  href={`tel:${tourist.phone}`}
                                  className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                                  title="Call tourist"
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                                <a 
                                  href={`mailto:${tourist.email}`}
                                  className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                                  title="Email tourist"
                                >
                                  <Mail className="w-4 h-4" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Status */}
                    {payment && (
                      <div className="border-t pt-4 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Payment Status:</span>
                          <span className={`font-medium ${
                            payment.status === 'PAID' 
                              ? 'text-green-600'
                              : payment.status === 'UNPAID'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <Link
                        href={`/tours/${tour.slug || tour._id}`}
                        className="text-[#1FB67A] hover:text-[#1dd489] text-sm font-medium"
                      >
                        View Tour Details
                      </Link>
                      <div className="flex space-x-3">
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
                      </div>
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
