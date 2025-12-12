'use client';

import React, { useState } from 'react';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useGetAllToursQuery } from '@/redux/features/tour/tour.api';
import { useCreateBookingMutation } from '@/redux/features/booking/booking.api';
import WishlistButton from '@/components/ui/WishlistButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { MapPin, Users, Star, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { Hero7 } from '@/components/hero7';

export default function HomePage() {
  const { data: userData, isLoading: userLoading } = useGetMeQuery({});
  const { data: toursData, isLoading: toursLoading } = useGetAllToursQuery({});
  const [createBooking, { isLoading: isCreatingBooking }] = useCreateBookingMutation();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);

  const tours = toursData?.data || [];

  const handleBookTour = (tour: any) => {
    if (!userData) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    if (userData.role !== 'TOURIST') {
      toast.error('Only tourists can book tours. Please register as a tourist to book experiences.');
      return;
    }

    // Check if user has address and phone number
    if (!userData.address || !userData.phone) {
      toast.error('Please update your profile with address and phone number before booking a tour. Go to Profile settings to update.');
      return;
    }

    setSelectedTour(tour);
    setShowBookingModal(true);
  };

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1FB67A]"></div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero7 userData={userData} />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LocalLens?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience destinations like a local with our trusted community of guides and authentic experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#1FB67A] rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Expertise</h3>
              <p className="text-gray-600">
                Connect with passionate local guides who know the hidden gems and authentic experiences in their cities.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#1FB67A] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Small Groups</h3>
              <p className="text-gray-600">
                Enjoy intimate experiences with small group sizes for personalized attention and meaningful connections.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#1FB67A] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Guaranteed</h3>
              <p className="text-gray-600">
                All our guides are verified and rated by fellow travelers to ensure exceptional experiences every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tours & Experiences</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover amazing local experiences curated by passionate guides around the world.
            </p>
          </div>

          {toursLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1FB67A]"></div>
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tours available yet</h3>
              <p className="text-gray-500">Check back soon for amazing local experiences!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.slice(0, 6).map((tour: any) => (
                <div key={tour._id} className="bg-white rounded-lg shadow-lg border overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Tour Image */}
                  <div className="relative h-48">
                    {tour.images && tour.images[0] ? (
                      <img 
                        src={tour.images[0]} 
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <WishlistButton tourId={tour._id} />
                    </div>
                    {tour.originalPrice && tour.originalPrice > tour.tourFee && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Save ${tour.originalPrice - tour.tourFee}
                      </div>
                    )}
                  </div>

                  {/* Tour Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">{tour.title}</h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{tour.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{tour.maxDuration}h</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Max {tour.maxGroupSize}</span>
                      </div>
                    </div>

                    {/* Guide Info */}
                    {tour.guideId && (
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tour.guideId.name || 'Local Guide'}</p>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            <span className="text-xs text-gray-600">{tour.rating || 4.8} ({tour.reviewCount || 0})</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price and Booking */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-900">${tour.tourFee}</span>
                        {tour.originalPrice && tour.originalPrice > tour.tourFee && (
                          <span className="text-sm text-gray-500 line-through ml-2">${tour.originalPrice}</span>
                        )}
                        <span className="text-sm text-gray-500 ml-1">/ person</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/tours/${tour.slug || tour._id}`}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                        >
                          View Details
                        </Link>
                        {userData && userData.role === 'TOURIST' ? (
                          <button 
                            onClick={() => handleBookTour(tour)}
                            className="flex-1 bg-[#1FB67A] text-white py-2 px-4 rounded-lg hover:bg-[#1dd489] transition-colors font-medium"
                          >
                            Book Now
                          </button>
                        ) : !userData ? (
                          <Link 
                            href="/login"
                            className="flex-1 bg-[#1FB67A] text-white py-2 px-4 rounded-lg hover:bg-[#1dd489] transition-colors text-center font-medium"
                          >
                            Login to Book
                          </Link>
                        ) : (
                          <button 
                            disabled
                            className="flex-1 bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed font-medium"
                            title="Only tourists can book tours"
                          >
                            Book Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tours.length > 6 && (
            <div className="text-center mt-12">
              <Link 
                href="/explore-tours"
                className="inline-block bg-[#1FB67A] text-white px-8 py-3 rounded-lg hover:bg-[#1dd489] transition-colors font-medium"
              >
                View All Tours
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        {selectedTour && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book Tour</DialogTitle>
              <DialogDescription>
                Complete your booking details below
              </DialogDescription>
            </DialogHeader>
            
            <div className="mb-3">
              <img 
                src={selectedTour.images?.[0] || '/placeholder-tour.jpg'} 
                alt={selectedTour.title}
                className="w-full h-24 object-cover rounded-lg mb-2"
              />
              <h4 className="font-medium text-gray-900 text-sm">{selectedTour.title}</h4>
              <div className="flex items-center text-xs text-gray-600 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{selectedTour.location}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date *
                </label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1FB67A] focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1FB67A] focus:border-transparent"
                >
                  {Array.from({ length: selectedTour.maxGroupSize }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Price per person:</span>
                  <span className="font-medium text-sm">${selectedTour.tourFee}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-bold text-[#1FB67A]">${(selectedTour.tourFee * guestCount).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedDate('');
                    setGuestCount(1);
                  }}
                  disabled={isCreatingBooking}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!selectedDate) {
                      toast.error('Please select a date');
                      return;
                    }

                    try {
                      const bookingDate = selectedDate;
                      const bookingTime = new Date(selectedDate).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      });
                      
                      const totalAmount = (selectedTour.tourFee || 0) * guestCount;

                      const bookingData = {
                        tourId: selectedTour._id,
                        guideId: selectedTour.guideId?._id || selectedTour.guideId,
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
                    } catch (error: any) {
                      toast.error(error?.data?.message || 'Failed to create booking. Please try again.');
                    }
                  }}
                  disabled={isCreatingBooking || !selectedDate}
                  className="flex-1 px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingBooking ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
