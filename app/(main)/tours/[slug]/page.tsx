'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetTourBySlugQuery, useGetTourByIdQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useCreateBookingMutation } from '@/redux/features/booking/booking.api';
import { useGetTourReviewsQuery } from '@/redux/features/review/review.api';
import WishlistButton from '@/components/ui/WishlistButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Info,
  ArrowLeft,
  Phone,
  Mail,
  Shield,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function TourDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slugOrId = params.slug as string;
  
  // Check if the parameter looks like a MongoDB ObjectId (24 hex characters)
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(slugOrId);
  
  // Use appropriate query based on whether it's an ID or slug
  const { data: tourBySlugData, isLoading: isLoadingBySlug, error: errorBySlug } = useGetTourBySlugQuery(slugOrId, {
    skip: isObjectId
  });
  const { data: tourByIdData, isLoading: isLoadingById, error: errorById } = useGetTourByIdQuery(slugOrId, {
    skip: !isObjectId
  });
  
  // Use the appropriate data source
  const tourData = isObjectId ? tourByIdData : tourBySlugData;
  const isLoading = isObjectId ? isLoadingById : isLoadingBySlug;
  const error = isObjectId ? errorById : errorBySlug;
  
  const { data: userData } = useGetMeQuery({});
  const [createBooking, { isLoading: isCreatingBooking }] = useCreateBookingMutation();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);

  const tour = tourData?.data;
  const { data: reviewsData, isLoading: isLoadingReviews } = useGetTourReviewsQuery(
    { tourId: tour?._id || '', page: 1, limit: 10 },
    { skip: !tour?._id }
  );
  const reviews = reviewsData?.data?.reviews || [];

  const handleBookTour = () => {
    if (!userData) {
      toast.error('Please login to book this tour');
      router.push('/login');
      return;
    }
    
    if (userData.role !== 'TOURIST') {
      toast.error('Only tourists can book tours');
      return;
    }

    // Check if user has address and phone number
    if (!userData.address || !userData.phone) {
      toast.error('Please update your profile with address and phone number before booking a tour. Go to Profile settings to update.');
      return;
    }

    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!tour || !userData) {
      toast.error('Missing tour or user information');
      return;
    }

    try {
      // Parse date and time
      const bookingDate = selectedDate;
      const bookingTime = new Date(selectedDate).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      const totalAmount = (tour.tourFee || 0) * guestCount;

      const bookingData = {
        tourId: tour._id,
        guideId: tour.guideId?._id || tour.guideId,
        bookingDate,
        bookingTime,
        numberOfGuests: guestCount,
        totalAmount,
      };

      await createBooking(bookingData).unwrap();
      
      toast.success('Booking request sent! The guide will review and confirm your booking.');
      setShowBookingModal(false);
      setSelectedDate('');
      setGuestCount(1);
      
      // Redirect to bookings page after a short delay
      setTimeout(() => {
        router.push('/dashboard/upcoming-bookings');
      }, 1500);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create booking. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1FB67A]"></div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
          <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/"
            className="bg-[#1FB67A] text-white px-6 py-3 rounded-lg hover:bg-[#1dd489] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = (tour.tourFee * guestCount).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Image Gallery */}
              <div className="relative h-96">
                {tour.images && tour.images.length > 0 ? (
                  <img 
                    src={tour.images[0]} 
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <WishlistButton tourId={tour._id} size="lg" />
                </div>
                {tour.originalPrice && tour.originalPrice > tour.tourFee && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg font-medium">
                    Save ${tour.originalPrice - tour.tourFee}
                  </div>
                )}
              </div>

              {/* Tour Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.title}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-lg">{tour.location}</span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{tour.maxDuration} hours</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Max {tour.maxGroupSize} guests</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        <span>{tour.rating || 4.8} ({tour.reviewCount || 0} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#1FB67A]">${tour.tourFee}</div>
                    {tour.originalPrice && tour.originalPrice > tour.tourFee && (
                      <div className="text-lg text-gray-500 line-through">${tour.originalPrice}</div>
                    )}
                    <div className="text-sm text-gray-600">per person</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Experience</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{tour.description}</p>
              {tour.longDescription && (
                <p className="text-gray-700 leading-relaxed">{tour.longDescription}</p>
              )}
            </div>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Highlights</h2>
                <ul className="space-y-2">
                  {tour.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[#1FB67A] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Itinerary</h2>
                <div className="space-y-4">
                  {tour.itinerary.map((item: any, index: number) => (
                    <div key={index} className="border-l-4 border-[#1FB67A] pl-4">
                      <div className="flex items-center mb-2">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-900">{item.time}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-700 text-sm">{item.description}</p>
                      {item.location && (
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included/Not Included */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tour.included && tour.included.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                  <ul className="space-y-2">
                    {tour.included.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tour.notIncluded && tour.notIncluded.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What's Not Included</h3>
                  <ul className="space-y-2">
                    {tour.notIncluded.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <XCircle className="w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Important Information */}
            {tour.importantInfo && tour.importantInfo.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Important Information</h3>
                <ul className="space-y-2">
                  {tour.importantInfo.map((info: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Info className="w-4 h-4 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cancellation Policy */}
            {tour.cancellationPolicy && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cancellation Policy</h3>
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{tour.cancellationPolicy}</p>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
              
              {isLoadingReviews ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1FB67A]"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No reviews yet. Be the first to review this tour!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review: any) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <img 
                            src={review.userId?.image || 'https://via.placeholder.com/40x40'} 
                            alt={review.userId?.name || 'User'}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.userId?.name || 'Anonymous'}</h4>
                            <div className="flex items-center mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-6 lg:h-fit space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-[#1FB67A] mb-1">${tour.tourFee}</div>
                {tour.originalPrice && tour.originalPrice > tour.tourFee && (
                  <div className="text-lg text-gray-500 line-through">${tour.originalPrice}</div>
                )}
                <div className="text-sm text-gray-600">per person</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Duration</span>
                  <span className="font-medium text-sm">{tour.maxDuration} hours</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Group Size</span>
                  <span className="font-medium text-sm">Max {tour.maxGroupSize}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Meeting Point</span>
                  <span className="font-medium text-right text-xs">{tour.meetingPoint}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 text-sm">Category</span>
                  <span className="font-medium text-sm">{tour.category}</span>
                </div>
              </div>

              <button
                onClick={handleBookTour}
                className="w-full bg-[#1FB67A] text-white py-3 rounded-lg font-semibold hover:bg-[#1dd489] transition-colors"
              >
                {userData && userData.role === 'TOURIST' ? 'Book This Experience' : 'Login to Book'}
              </button>

              {userData && userData.role === 'TOURIST' && (
                <p className="text-center text-xs text-gray-500 mt-2">
                  Free cancellation up to 24 hours before the tour
                </p>
              )}
            </div>

            {/* Guide Information */}
            {tour.guideId && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Guide</h3>
                <div className="flex items-center mb-4">
                  <img 
                    src={tour.guideId.image || 'https://via.placeholder.com/60x60'} 
                    alt={tour.guideId.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{tour.guideId.name}</h4>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">{tour.rating || 4.8} rating</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Award className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-sm text-gray-600">Verified Guide</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Phone className="w-4 h-4 mr-1" />
                    Contact
                  </button>
                  <button className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Mail className="w-4 h-4 mr-1" />
                    Message
                  </button>
                </div>
              </div>
            )}

            {/* Tour Stats - Compact Version */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bookings</span>
                  <span className="font-medium">{tour.bookingCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-medium">{tour.reviewCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tour.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tour.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Your Experience</DialogTitle>
            <DialogDescription>
              Complete your booking details below
            </DialogDescription>
          </DialogHeader>
          
          {/* Tour Summary */}
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 text-sm mb-1">{tour.title}</h4>
            <div className="flex items-center text-xs text-gray-600">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{tour.location}</span>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date *
              </label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1FB67A] focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests *
              </label>
              <select 
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1FB67A] focus:border-transparent"
              >
                {Array.from({ length: tour.maxGroupSize }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Price Summary */}
            <div className="border-t pt-3 mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">${tour.tourFee} × {guestCount} guest{guestCount > 1 ? 's' : ''}</span>
                <span className="font-medium text-sm">${totalPrice}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Total</span>
                <span className="text-lg font-bold text-[#1FB67A]">${totalPrice}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isCreatingBooking || !selectedDate}
                className="flex-1 px-4 py-3 bg-[#1FB67A] text-white rounded-lg hover:bg-[#1dd489] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingBooking ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

