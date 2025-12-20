'use client';

import React from 'react';
import { Calendar, MapPin, Clock, Users, Star, Phone, Mail, DollarSign, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useGetMyBookingsQuery } from '@/redux/features/booking/booking.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';

export default function MyAllToursPage() {
  const { data: userData } = useGetMeQuery({});
  const { data: bookingsData, isLoading, error } = useGetMyBookingsQuery({}, { 
    skip: !userData || userData.role !== 'TOURIST' 
  });

  // Filter for tours with successful payment (COMPLETED status and PAID payment)
  const allBookings = bookingsData?.data || [];
  const paidTours = allBookings.filter((booking: any) => {
    const payment = booking.payment || {};
    return booking.status === 'COMPLETED' && payment.status === 'PAID';
  });

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
          <p className="text-red-800">Failed to load tours. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My All Tours</h1>
        <p className="text-gray-600">All your successfully paid and completed tours</p>
      </div>

      {paidTours.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No paid tours found</h3>
          <p className="text-gray-500 mb-6">
            You don't have any successfully paid tours yet.
          </p>
          <Link 
            href="/explore-tours"
            className="inline-block bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {paidTours.map((booking: any) => {
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
                  
                  {/* Tour Details */}
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
                        <div className="flex items-center justify-end text-green-600 text-sm mb-2">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span>Paid & Completed</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Confirmation */}
                    <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-green-900">Payment Confirmed</div>
                            <div className="text-xs text-green-700">
                              Transaction ID: {payment.transactionId || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-900">${payment.amount || booking.totalAmount}</div>
                          <div className="text-xs text-green-700">Paid on {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}</div>
                        </div>
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

                    {/* Booking Date Info */}
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
                        <div>
                          <span className="text-gray-500">Completed on:</span>
                          <span className="ml-2 text-gray-900">
                            {booking.updatedAt ? new Date(booking.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'}
                          </span>
                        </div>
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
            );
          })}
        </div>
      )}
    </div>
  );
}

