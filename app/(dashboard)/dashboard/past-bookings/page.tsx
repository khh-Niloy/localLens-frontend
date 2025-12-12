'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Star, Download, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function PastBookingsPage() {
  // TODO: Replace with actual API call to fetch past bookings
  const pastBookings: any[] = [];
  
  const [ratingModal, setRatingModal] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleRateExperience = (bookingId: string) => {
    setRatingModal(bookingId);
    setSelectedRating(0);
    setReviewText('');
  };

  const submitRating = () => {
    // TODO: Implement API call to submit rating
    console.log('Submitting rating:', { bookingId: ratingModal, rating: selectedRating, review: reviewText });
    setRatingModal(null);
  };

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
          {pastBookings.map((booking) => (
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
                        <span>Completed on {new Date(booking.completedDate).toLocaleDateString('en-US', { 
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
                      <div className="text-2xl font-bold text-gray-700">${booking.totalPrice}</div>
                      <div className="text-sm text-gray-500">Booking #{booking.bookingId}</div>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Completed
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
                        {booking.userRating && (
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-1">Your rating:</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-4 h-4 ${star <= booking.userRating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div className="flex space-x-3">
                      <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 text-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                      </button>
                      <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 text-sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Support
                      </button>
                    </div>
                    <div className="space-x-3">
                      {!booking.userRating ? (
                        <button 
                          onClick={() => handleRateExperience(booking.id)}
                          className="px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] text-sm"
                        >
                          Rate Experience
                        </button>
                      ) : (
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                          Book Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
                Write a review (optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1FB67A] focus:border-transparent"
                placeholder="Share your experience with other travelers..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setRatingModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={selectedRating === 0}
                className="flex-1 px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
