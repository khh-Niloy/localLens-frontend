'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Phone, Mail, DollarSign, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useGetMyBookingsQuery } from '@/redux/features/booking/booking.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';

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
  const { data: bookingsData, isLoading, error } = useGetMyBookingsQuery({}, { 
    skip: !userData || userData.role !== 'TOURIST' 
  });

  const [activeTab, setActiveTab] = useState<'ongoing' | 'past'>('ongoing');

  // Filter bookings
  const today = new Date().toISOString().split('T')[0];
  const allBookings = bookingsData?.data || [];
  
  // Ongoing trips: CONFIRMED status with future dates
  const ongoingTrips = allBookings.filter((booking: any) => {
    const bookingDate = booking.bookingDate || booking.createdAt;
    const isFuture = bookingDate >= today;
    return booking.status === 'CONFIRMED' && isFuture;
  });

  // Past trips: COMPLETED status or past dates
  const pastTrips = allBookings.filter((booking: any) => {
    const bookingDate = booking.bookingDate || booking.createdAt;
    const isPast = bookingDate < today;
    const isCompleted = booking.status === 'COMPLETED' || booking.status === 'CANCELLED';
    return isPast || isCompleted;
  });

  const displayedTrips = activeTab === 'ongoing' ? ongoingTrips : pastTrips;

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
          <p className="text-red-800">Failed to load trips. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
        <p className="text-gray-600">Manage your ongoing and past tour experiences</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ongoing'
                ? 'border-[#1FB67A] text-[#1FB67A]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Ongoing Trips ({ongoingTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-[#1FB67A] text-[#1FB67A]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Past Trips ({pastTrips.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {displayedTrips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'ongoing' ? 'No ongoing trips' : 'No past trips'}
          </h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'ongoing'
              ? "You don't have any ongoing trips at the moment."
              : "You don't have any completed trips yet."}
          </p>
          {activeTab === 'ongoing' && (
            <Link
              href="/explore-tours"
              className="inline-block bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
            >
              Browse Tours
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {displayedTrips.map((booking: any) => {
            const tour = booking.tourId || {};
            const guide = booking.guideId || {};
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
                        {payment.amount && (
                          <div className="text-xs text-gray-500 mt-1">
                            Amount: ${payment.amount}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Guide Information */}
                    {guide && (
                      <div className="border-t pt-4 mb-4">
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
                                <div className="flex items-center text-xs text-gray-600">
                                  <Mail className="w-3 h-3 mr-1" />
                                  <span>{guide.email}</span>
                                </div>
                              )}
                              {guide.phone && (
                                <div className="flex items-center text-xs text-gray-600">
                                  <Phone className="w-3 h-3 mr-1" />
                                  <span>{guide.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">{booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex space-x-2">
                              {guide.phone && (
                                <a 
                                  href={`tel:${guide.phone}`}
                                  className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                                  title="Call guide"
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                              )}
                              {guide.email && (
                                <a 
                                  href={`mailto:${guide.email}`}
                                  className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                                  title="Email guide"
                                >
                                  <Mail className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Booking Info */}
                    <div className="border-t pt-4 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Booked on:</span>
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
                      <div className="flex items-center space-x-3">
                        {paymentStatus === 'PAID' && (
                          <div className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span>Payment Confirmed</span>
                          </div>
                        )}
                        {guide.phone && (
                          <a 
                            href={`tel:${guide.phone}`}
                            className="px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] text-sm"
                          >
                            Contact Guide
                          </a>
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
    </div>
  );
}

