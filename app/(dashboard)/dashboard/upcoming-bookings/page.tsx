'use client';

import React from 'react';
import { Calendar, MapPin, Clock, Users, Star, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function UpcomingBookingsPage() {
  // TODO: Replace with actual API call to fetch upcoming bookings
  const upcomingBookings: any[] = [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Bookings</h1>
        <p className="text-gray-600">Your confirmed tours and experiences</p>
      </div>

      {upcomingBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
          <p className="text-gray-500 mb-6">You don't have any tours booked yet.</p>
          <Link 
            href="/explore-tours"
            className="inline-block bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow border overflow-hidden">
              <div className="md:flex">
                {/* Tour Image */}
                <div className="md:w-1/3">
                  <img 
                    src={booking.tourImage} 
                    alt={booking.tourTitle}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                
                {/* Booking Details */}
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{booking.tourTitle}</h3>
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
                        <span>{booking.bookingTime} • {booking.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{booking.meetingPoint}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#1FB67A]">${booking.totalPrice}</div>
                      <div className="text-sm text-gray-500">Booking #{booking.bookingId}</div>
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Guide Information */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Your Guide</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={booking.guide.image} 
                          alt={booking.guide.name}
                          className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{booking.guide.name}</p>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-600">{booking.guide.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{booking.groupSize} guests</span>
                        </div>
                        <div className="flex space-x-2">
                          <a 
                            href={`tel:${booking.guide.phone}`}
                            className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                            title="Call guide"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <a 
                            href={`mailto:${booking.guide.email}`}
                            className="p-2 text-gray-400 hover:text-[#1FB67A] transition-colors"
                            title="Email guide"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Cancel Booking
                    </button>
                    <div className="space-x-3">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] text-sm">
                        Contact Guide
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
