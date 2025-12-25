"use client";

import { useGetAllToursQuery } from "@/redux/features/tour/tour.api";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useCreateBookingMutation } from "@/redux/features/booking/booking.api";
import { motion } from "framer-motion";
import { BookOpen, Clock, MapPin, Star, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import WishlistButton from "../ui/WishlistButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import TourCard from "../TourCard";

export default function FeaturedTours() {
  const { data: toursData, isLoading: toursLoading, error: toursError } = useGetAllToursQuery({ isFeatured: true });
  const { data: userData } = useGetMeQuery({});
  const [createBooking, { isLoading: isCreatingBooking }] = useCreateBookingMutation();

  const tours = toursData?.data || [];

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [guestCount, setGuestCount] = useState(1);

  const handleBookTour = (tour: any) => {
    if (!userData) {
      window.location.href = '/login';
      return;
    }

    if (userData.role !== 'TOURIST') {
      toast.error('Only tourists can book tours. Please register as a tourist to book experiences.');
      return;
    }

    if (!userData.address || !userData.phone) {
      toast.error('Please update your profile with address and phone number before booking a tour. Go to Profile settings to update.');
      return;
    }

    setSelectedTour(tour);
    setShowBookingModal(true);
  };

  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <motion.h4 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#4088FD] font-bold tracking-[0.2em] uppercase text-xs mb-4"
            >
              Top Picks
            </motion.h4>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
            >
              Featured Tours & <span className="text-[#4088FD]">Experiences</span>
            </motion.h2>
          </div>

          {toursLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4088FD]"></div>
            </div>
          ) : toursError ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load tours</h3>
              <p className="text-gray-500 mb-4">
                {(toursError as any)?.data?.message || 'Please refresh the page or try again later.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#4088FD] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tours available yet</h3>
              <p className="text-gray-500">Check back soon for amazing local experiences!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {tours.slice(0, 8).map((tour: any) => (
                <TourCard 
                  key={tour._id} 
                  tour={tour} 
                  userData={userData} 
                  onBook={handleBookTour} 
                />
              ))}
            </div>
          )}

        
                  {tours.length > 6 && (
                    <div className="text-center mt-8 sm:mt-10 md:mt-12">
                      <Link 
                        href="/explore-tours"
                        className="inline-block bg-[#4088FD] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base shadow-lg shadow-blue-100"
                      >
                        View All Experiences
                      </Link>
                    </div>
                  )}
                </div>
              </section>

              <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        {selectedTour && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book Tour</DialogTitle>
              <DialogDescription>
                Complete your booking details below
              </DialogDescription>
            </DialogHeader>
            
            <div className="mb-3 p-4 bg-gray-50 rounded-2xl">
              <h4 className="font-bold text-gray-900 text-sm mb-1">{selectedTour.title}</h4>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1 text-[#4088FD]" />
                <span>{selectedTour.location}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Select Date *
                </label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4088FD] transition-all"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Guests *
                </label>
                <select 
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4088FD] transition-all"
                >
                  {Array.from({ length: selectedTour.maxGroupSize }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-1 text-sm text-gray-500">
                  <span>Price per person:</span>
                  <span className="font-bold text-gray-900">{selectedTour.tourFee} TK</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-black text-[#4088FD]">{(selectedTour.tourFee * guestCount).toFixed(2)} TK</span>
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
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm"
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
                  className="flex-1 px-4 py-3 bg-[#4088FD] text-white rounded-xl font-bold hover:bg-blue-600 transition-all text-sm shadow-lg shadow-blue-100"
                >
                  {isCreatingBooking ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
        </>
    );
}