'use client';

import React, { useState } from 'react';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { useGetAllToursQuery } from '@/redux/features/tour/tour.api';
import { useCreateBookingMutation } from '@/redux/features/booking/booking.api';
import WishlistButton from '@/components/ui/WishlistButton';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { MapPin, Users, Star, ArrowRight, Clock, BookOpen, Shield, Headphones } from 'lucide-react';
import { Hero7 } from '@/components/hero7';
import CategoryTours from '@/components/CategoryTours';
import FeaturedTours from '@/components/Home/FeaturedTours';

export default function HomePage() {
  const { data: userData, isLoading: userLoading, error: userError } = useGetMeQuery({});
  const [createBooking, { isLoading: isCreatingBooking }] = useCreateBookingMutation();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);

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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4088FD]"></div>
      </div>
    );
  }


  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero7 userData={userData} />

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.h4 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#4088FD] font-bold tracking-[0.2em] uppercase text-xs mb-4"
            >
              Why Choose Us
            </motion.h4>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
            >
              High quality service for your <span className="text-[#4088FD]">Experience</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 max-w-[1400px] mx-auto">
            {/* Feature 1 - Purple */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               whileHover={{ y: -5, scale: 1.02 }}
               viewport={{ once: true }}
               className="bg-[#F9F5FF] p-8 rounded-[2rem] border border-purple-100/50 flex flex-col items-start text-left transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 hover:bg-white"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#A855F7] to-[#8B5CF6] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-300/40">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-gray-900 mb-3">Local Expertise</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed font-medium opacity-80">
                Discover authentic hidden gems only passionate local guides know.
              </p>
            </motion.div>
            
            {/* Feature 2 - Blue */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               whileHover={{ y: -5, scale: 1.02 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="bg-[#EFF6FF] p-8 rounded-[2rem] border border-blue-100/50 flex flex-col items-start text-left transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:bg-white"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-300/40">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-gray-900 mb-3">Small Groups</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed font-medium opacity-80">
                Enjoy intimate experiences designed for meaningful connections.
              </p>
            </motion.div>
            
            {/* Feature 3 - Cyan */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               whileHover={{ y: -5, scale: 1.02 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="bg-[#ECFEFF] p-8 rounded-[2rem] border border-cyan-100/50 flex flex-col items-start text-left transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 hover:bg-white"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-cyan-300/40">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-gray-900 mb-3">Verified Quality</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed font-medium opacity-80">
                Hand-picked guides ensuring a safe and premium journey for you.
              </p>
            </motion.div>

            {/* Feature 4 - Emerald */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               whileHover={{ y: -5, scale: 1.02 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="bg-[#ECFDF5] p-8 rounded-[2rem] border border-emerald-100/50 flex flex-col items-start text-left transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:bg-white"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-300/40">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-gray-900 mb-3">Secure Payments</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed font-medium opacity-80">
                Worry-free transactions with our fully encrypted booking system.
              </p>
            </motion.div>

            {/* Feature 5 - Rose */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               whileHover={{ y: -5, scale: 1.02 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 }}
               className="bg-[#FFF1F2] p-8 rounded-[2rem] border border-rose-100/50 flex flex-col items-start text-left transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/5 hover:bg-white"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#F43F5E] to-[#E11D48] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-rose-300/40">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed font-medium opacity-80">
                Our team is always ready to assist you at every step of your trip.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Category Wise Tours Section */}
      <CategoryTours userData={userData} handleBookTour={handleBookTour} />

      {/* Featured Tours Section */}
      <FeaturedTours />

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4088FD 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10 sm:mb-14 md:mb-20">
            <motion.h4 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-[#4088FD] font-bold tracking-[0.3em] uppercase text-xs mb-4"
            >
              The Process
            </motion.h4>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
            >
              Simple steps to <span className="text-[#4088FD]">Explore</span>
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 max-w-7xl mx-auto relative px-2 sm:px-4">
            {/* Steps Connector Line */}
            <div className="hidden xl:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

            {/* Step 1 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-4 sm:mb-6 md:mb-8">
                <div className="w-24 h-24 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex items-center justify-center relative z-10 border border-gray-50 group-hover:scale-110 group-hover:border-purple-100 transition-all duration-500">
                  <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-indigo-600">1</span>
                </div>
                <div className="absolute -inset-2 bg-purple-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Browse Tours</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[220px] font-medium opacity-80">
                Explore our curated collection of authentic local experiences and find your match.
              </p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-4 sm:mb-6 md:mb-8">
                <div className="w-24 h-24 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex items-center justify-center relative z-10 border border-gray-50 group-hover:scale-110 group-hover:border-blue-100 transition-all duration-500">
                  <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-500 to-blue-700">2</span>
                </div>
                <div className="absolute -inset-2 bg-blue-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Book Trip</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[220px] font-medium opacity-80">
                Select your date, guests, and submit your request with a single click.
              </p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-4 sm:mb-6 md:mb-8">
                <div className="w-24 h-24 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex items-center justify-center relative z-10 border border-gray-50 group-hover:scale-110 group-hover:border-cyan-100 transition-all duration-500">
                  <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-cyan-500 to-cyan-700">3</span>
                </div>
                <div className="absolute -inset-2 bg-cyan-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Confirmed</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[220px] font-medium opacity-80">
                Your guide will review and confirm all details for your upcoming journey.
              </p>
            </motion.div>
            
            {/* Step 4 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-4 sm:mb-6 md:mb-8">
                <div className="w-24 h-24 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex items-center justify-center relative z-10 border border-gray-50 group-hover:scale-110 group-hover:border-emerald-100 transition-all duration-500">
                  <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-emerald-700">4</span>
                </div>
                <div className="absolute -inset-2 bg-emerald-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enjoy & Pay</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[220px] font-medium opacity-80">
                Experience your local tour, then complete payment securely.
              </p>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        {selectedTour && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book Experience</DialogTitle>
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

    </div>
  );
}
