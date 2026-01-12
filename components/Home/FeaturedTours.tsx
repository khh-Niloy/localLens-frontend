"use client";

import { useGetFeaturedToursQuery } from "@/redux/features/tour/tour.api";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useCreateBookingMutation } from "@/redux/features/booking/booking.api";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, MapPin, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import TourCard from "../TourCard";

export default function FeaturedTours() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const { data: toursData, isLoading: toursLoading, error: toursError } = useGetFeaturedToursQuery({ cursor });
  const { data: userData } = useGetMeQuery({});
  const [createBooking, { isLoading: isCreatingBooking }] = useCreateBookingMutation();

  const [allTours, setAllTours] = useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [guestCount, setGuestCount] = useState(1);

  // Append new tours to the list when they are fetched
  useEffect(() => {
    if (toursData?.data) {
      setAllTours(prev => {
        // Avoid duplicates if any
        const existingIds = new Set(prev.map(t => t._id));
        const newTours = toursData.data.filter((t: any) => !existingIds.has(t._id));
        return [...prev, ...newTours];
      });
    }
  }, [toursData]);

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
      toast.error('Please update your profile with address and phone number before booking a tour.');
      return;
    }

    setSelectedTour(tour);
    setShowBookingModal(true);
  };

  const nextFive = () => {
    const nextStart = (page + 1) * 4;
    if (nextStart < allTours.length) {
      setDirection(1);
      setPage(page + 1);
    } else if (toursData?.nextCursor) {
      setCursor(toursData.nextCursor);
      setDirection(1);
      setPage(page + 1);
    }
  };

  const prevFive = () => {
    if (page > 0) {
      setDirection(-1);
      setPage(page - 1);
    }
  };

  const displayedTours = allTours.slice(page * 4, (page + 1) * 4);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <>
      <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 md:mb-16">
            <div className="text-left">
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
            
            <div className="flex items-center gap-3 mt-6 md:mt-0">
              <button 
                onClick={prevFive}
                disabled={page === 0}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#4088FD] hover:border-[#4088FD] hover:text-white transition-all duration-300 text-gray-600 shadow-sm disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button 
                onClick={nextFive}
                disabled={!toursData?.nextCursor && (page + 1) * 5 >= allTours.length}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#4088FD] hover:border-[#4088FD] hover:text-white transition-all duration-300 text-gray-600 shadow-sm disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:cursor-not-allowed"
              >
                {toursLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" strokeWidth={2.5} />}
              </button>
            </div>
          </div>

          {toursLoading && allTours.length === 0 ? (
            <div className="flex justify-center py-20">
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
          ) : allTours.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tours available yet</h3>
              <p className="text-gray-500">Check back soon for amazing local experiences!</p>
            </div>
          ) : (
            <div className="relative min-h-[330px]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div 
                  key={page}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 absolute w-full"
                >
                  {displayedTours.map((tour: any) => (
                    <TourCard 
                      key={tour._id} 
                      tour={tour} 
                      userData={userData} 
                      onBook={handleBookTour} 
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          <div className="text-center">
            <Link 
              href="/explore-tours"
              className="inline-flex items-center gap-2 text-gray-900 font-bold hover:text-[#4088FD] transition-colors group"
            >
              Explore all experiences 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
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
                    setSelectedDate("");
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
                      setSelectedDate("");
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