"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, MapPin, Clock, Users, Calendar, Heart, Share2, MessageCircle, Award, Globe, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// TODO: Replace with actual API call to get tour by ID
const getTourById = (id: string) => {
  // This should be replaced with actual API call
  return null;
};

export default function TourDetailsPage() {
  const params = useParams();
  const tourId = params.id as string;
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  
  const tour = getTourById(tourId);
  
  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
          <p className="text-gray-600">The tour you're looking for doesn't exist.</p>
          <Link href="/explore" className="text-[#1FB67A] hover:underline mt-4 inline-block">
            Browse all tours
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleBookingRequest = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }
    setShowBookingModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/explore" className="hover:text-[#1FB67A]">Explore</Link>
          <span>/</span>
          <span className="capitalize">{tour.category}</span>
          <span>/</span>
          <span className="text-gray-900">{tour.title}</span>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {renderStars(tour.rating)}
                <span className="font-semibold">{tour.rating}</span>
                <span className="text-gray-600">({tour.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{tour.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Heart className="w-4 h-4" />
              Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Tour Image {activeImageIndex + 1}</span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {tour.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    activeImageIndex === index ? 'ring-2 ring-[#1FB67A]' : ''
                  }`}
                >
                  <span className="text-xs text-gray-500">{index + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8">
              {['overview', 'itinerary', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-[#1FB67A] text-[#1FB67A]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">About this experience</h3>
                  <p className="text-gray-700 mb-4">{tour.longDescription}</p>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">What you'll do</h3>
                  <ul className="space-y-2">
                    {tour.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#1FB67A] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What's Included */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What's included</h3>
                    <ul className="space-y-2">
                      {tour.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Not included</h3>
                    <ul className="space-y-2">
                      {tour.notIncluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-4 h-4 border border-gray-300 rounded-full flex-shrink-0 mt-1" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Important Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Important information</h3>
                  <ul className="space-y-2">
                    {tour.importantInfo.map((info, index) => (
                      <li key={index} className="text-gray-700 text-sm">
                        • {info}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cancellation Policy */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Cancellation policy</h3>
                  <p className="text-gray-700 text-sm">{tour.cancellationPolicy}</p>
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Tour itinerary</h3>
                <div className="space-y-4">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-16 text-sm font-medium text-[#1FB67A]">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-700 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Reviews ({tour.reviewCount})</h3>
                  <div className="flex items-center gap-2">
                    {renderStars(tour.rating)}
                    <span className="font-semibold">{tour.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {tour.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                          {review.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.author}</h4>
                              <div className="flex items-center gap-2">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-600">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <button className="text-sm text-gray-500 hover:text-gray-700">
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Guide Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold">
                {tour.guide.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Meet your guide: {tour.guide.name}</h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    {renderStars(tour.guide.rating)}
                    <span className="font-semibold">{tour.guide.rating}</span>
                    <span className="text-gray-600">({tour.guide.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{tour.guide.languages.join(', ')}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{tour.guide.bio}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Response rate: {tour.guide.responseRate}%</span>
                  <span>Response time: {tour.guide.responseTime}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/profile/${tour.guide.id}`}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  View Profile
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] transition-colors text-sm">
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold text-gray-900">${tour.price}</span>
                {tour.originalPrice && (
                  <span className="text-lg text-gray-500 line-through ml-2">${tour.originalPrice}</span>
                )}
                <span className="text-gray-600 text-sm ml-1">per person</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <select
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime(''); // Reset time when date changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
                >
                  <option value="">Choose a date</option>
                  {tour.availableDates.map((dateObj) => (
                    <option key={dateObj.date} value={dateObj.date}>
                      {new Date(dateObj.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    {tour.availableDates
                      .find(d => d.date === selectedDate)
                      ?.times.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 border rounded-md text-sm ${
                            selectedTime === time
                              ? 'border-[#1FB67A] bg-[#1FB67A] text-white'
                              : 'border-gray-300 hover:border-[#1FB67A]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="font-medium">{guests} guests</span>
                  <button
                    onClick={() => setGuests(Math.min(tour.maxGroupSize, guests + 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum {tour.maxGroupSize} guests</p>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>${tour.price} × {guests} guests</span>
                  <span>${tour.price * guests}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${tour.price * guests}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookingRequest}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-[#1FB67A] text-white py-3 px-4 rounded-md hover:bg-[#1dd489] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Request to Book
              </button>

              <p className="text-xs text-gray-500 text-center">
                You won't be charged yet. The guide will review your request.
              </p>
            </div>

            {/* Tour Details */}
            <div className="border-t pt-4 mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{tour.duration} hours</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Max {tour.maxGroupSize} people</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{tour.meetingPoint}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>{tour.guide.languages.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Booking Request</h3>
            <div className="space-y-3 mb-6">
              <p><strong>Tour:</strong> {tour.title}</p>
              <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Guests:</strong> {guests}</p>
              <p><strong>Total:</strong> ${tour.price * guests}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Booking request sent! The guide will review and respond soon.');
                  setShowBookingModal(false);
                }}
                className="flex-1 px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

