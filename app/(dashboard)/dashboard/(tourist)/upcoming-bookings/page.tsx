'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Star, Phone, Mail, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { useGetMyBookingsQuery } from '@/redux/features/booking/booking.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';

export default function UpcomingBookingsPage() {
  const { data: userData } = useGetMeQuery({});
  const { data: bookingsData, isLoading, error } = useGetMyBookingsQuery({}, { 
    skip: !userData || userData.role !== 'TOURIST' 
  });

  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Filter for upcoming bookings (PENDING, CONFIRMED status and future dates)
  const today = new Date().toISOString().split('T')[0];
  const allBookings = bookingsData?.data || [];
  const baseUpcomingBookings = allBookings.filter((booking: any) => {
    const bookingDate = booking.bookingDate || booking.createdAt;
    const isFuture = bookingDate >= today;
    const isUpcoming = booking.status === 'PENDING' || booking.status === 'CONFIRMED';
    return isFuture && isUpcoming;
  });

  // Extract unique values for filters
  const uniqueDestinations = Array.from(
    new Set(baseUpcomingBookings.map((b: any) => b.tourId?.location).filter(Boolean))
  ).sort();
  const uniqueLanguages = Array.from(
    new Set(
      baseUpcomingBookings
        .map((b: any) => b.guideId?.language || [])
        .flat()
        .filter(Boolean)
    )
  ).sort();
  const categories = ['CULTURAL', 'FOOD', 'HISTORICAL', 'ADVENTURE', 'NATURE', 'ART'];

  // Apply additional filters
  const upcomingBookings = baseUpcomingBookings.filter((booking: any) => {
    const tour = booking.tourId || {};
    const guide = booking.guideId || {};

    const matchesDestination = !selectedDestination || tour.location === selectedDestination;
    const matchesLanguage = !selectedLanguage || 
                           (guide.language && Array.isArray(guide.language) && guide.language.includes(selectedLanguage));
    const matchesCategory = !selectedCategory || tour.category === selectedCategory;
    const matchesPrice = (!priceRange.min || (tour.tourFee || 0) >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || (tour.tourFee || 0) <= parseFloat(priceRange.max));

    return matchesDestination && matchesLanguage && matchesCategory && matchesPrice;
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
          <p className="text-red-800">Failed to load bookings. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Bookings</h1>
        <p className="text-gray-600">Your confirmed tours and experiences</p>
      </div>

      {upcomingBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {baseUpcomingBookings.length === 0 
              ? 'No upcoming bookings' 
              : 'No trips match your filters'}
          </h3>
          <p className="text-gray-500 mb-6">
            {baseUpcomingBookings.length === 0
              ? "You don't have any tours booked yet."
              : "Try adjusting your filters to see more results."}
          </p>
          {baseUpcomingBookings.length === 0 ? (
            <Link 
              href="/explore-tours"
              className="inline-block bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
            >
              Browse Tours
            </Link>
          ) : (
            <button
              onClick={() => {
                setSelectedDestination('');
                setSelectedLanguage('');
                setSelectedCategory('');
                setPriceRange({ min: '', max: '' });
              }}
              className="inline-block bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingBookings.map((booking: any) => {
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
                        <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                          booking.status === 'CONFIRMED' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
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
                            {guide.phone && (
                              <div className="flex space-x-2">
                                <a 
                                  href={`tel:${guide.phone}`}
                                  className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                                  title="Call guide"
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                                <a 
                                  href={`mailto:${guide.email}`}
                                  className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                                  title="Email guide"
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
                      <div className="border-t pt-4 mt-4">
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
                      <div className="space-x-3">
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
