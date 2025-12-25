'use client';

import React, { useState } from 'react';
import { useGetAllToursQuery, useGetTourEnumsQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { motion, AnimatePresence } from 'framer-motion';
import TourCard from '@/components/TourCard';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { 
  MapPin, 
  Search,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function ExploreToursPage() {
  const { data: toursData, isLoading } = useGetAllToursQuery({});
  const { data: enumsResponse } = useGetTourEnumsQuery(undefined);
  const { data: userData } = useGetMeQuery({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);

  const tours = toursData?.data || [];

  // Extract unique destinations and languages from tours
  const uniqueDestinations: string[] = Array.from(new Set(tours.map((tour: any) => tour.location).filter(Boolean))).sort() as string[];
  const uniqueLanguages: string[] = Array.from(
    new Set(
      tours
        .map((tour: any) => tour.guideId?.language || [])
        .flat()
        .filter(Boolean)
    )
  ).sort() as string[];

  // Filter tours based on search and filters
  const filteredTours = tours.filter((tour: any) => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || tour.category === selectedCategory;
    
    const matchesDestination = !selectedDestination || tour.location === selectedDestination;
    
    const matchesLanguage = !selectedLanguage || 
                           (tour.guideId?.language && Array.isArray(tour.guideId.language) && 
                            tour.guideId.language.includes(selectedLanguage));
    
    const matchesPrice = (!priceRange.min || tour.tourFee >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || tour.tourFee <= parseFloat(priceRange.max));
    
    return matchesSearch && matchesCategory && matchesDestination && matchesLanguage && matchesPrice;
  });

  const categories = enumsResponse?.data?.categories || [];

  const handleBookTour = (tour: any) => {
    if (!userData) {
      toast.error('Please login to book this tour');
      window.location.href = '/login';
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

    setSelectedTour(tour);
    setShowBookingModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4088FD]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-24 md:pt-24 md:pb-32 border-b border-gray-100">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-sky-50/50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#4088FD] text-xs font-black uppercase tracking-widest mb-6"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#4088FD] animate-pulse" />
              Bangladesh Awaits
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight"
            >
              Explore Amazing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4088FD] to-blue-600">Experiences</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
            >
              Discover unique adventures, authentic local culture, and hidden gems curated by passionate Bangladeshi guides.
            </motion.p>
            
            {/* Search Bar Container */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto relative group"
            >
              <div className="absolute inset-0 bg-blue-100/50 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#4088FD] transition-colors" />
                <input
                  type="text"
                  placeholder="Search experiences, cities, or guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-blue-100/20 text-lg text-gray-900 outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#4088FD] transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-10 relative z-20 pb-20">
        {/* Filters Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-100/10 border border-white/50 p-8 mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
              <Filter className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Refine Discovery</h2>
            <button
               onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedDestination('');
                setSelectedLanguage('');
                setPriceRange({ min: '', max: '' });
              }}
              className="ml-auto text-xs font-bold uppercase tracking-widest text-[#4088FD] hover:text-blue-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Destination Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Destination</label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full bg-gray-50/50 border border-transparent hover:border-blue-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 focus:bg-white focus:border-[#4088FD] transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">All Regions</option>
                {uniqueDestinations.map((destination: string) => (
                  <option key={destination} value={destination}>{destination}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Experience Type</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-50/50 border border-transparent hover:border-blue-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 focus:bg-white focus:border-[#4088FD] transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Communication</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-gray-50/50 border border-transparent hover:border-blue-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 focus:bg-white focus:border-[#4088FD] transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">Any Language</option>
                {uniqueLanguages.map((language: string) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Price Range (TK)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-[#4088FD] rounded-2xl px-4 py-4 text-sm font-bold text-gray-700 transition-all outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-[#4088FD] rounded-2xl px-4 py-4 text-sm font-bold text-gray-700 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Info */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-10 px-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {filteredTours.length} <span className="text-gray-400 text-2xl font-bold ml-1">Experiences Found</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-widest">
            <SlidersHorizontal className="w-4 h-4" />
            Sorted by relevance
          </div>
        </div>

        {/* Dynamic Grid with AnimatePresence */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredTours.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8">
                  <Search className="w-10 h-10 text-[#4088FD]" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No Experiences Found</h3>
                <p className="text-gray-500 max-w-sm font-medium mb-10 leading-relaxed">
                  We couldn't find any tours matching your current filters. Try adjusting your preferences!
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedDestination('');
                    setSelectedLanguage('');
                    setPriceRange({ min: '', max: '' });
                  }}
                  className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-[#4088FD] transition-all shadow-xl shadow-gray-100"
                >
                  View All Experiences
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredTours.map((tour: any, index: number) => (
                  <motion.div
                    key={tour._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TourCard 
                      tour={tour} 
                      userData={userData} 
                      onBook={handleBookTour} 
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modernized Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        {selectedTour && (
          <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0">
             <div className="h-24 bg-gradient-to-r from-[#4088FD] to-blue-600 flex items-center justify-center">
               <h3 className="text-xl font-black text-white tracking-tight">Experience Summary</h3>
             </div>
            
            <div className="p-8">
              <div className="mb-6 p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                <h4 className="font-black text-gray-900 text-lg mb-2 leading-tight">{selectedTour.title}</h4>
                <div className="flex items-center text-sm text-[#4088FD] font-bold mb-4">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  <span>{selectedTour.location}</span>
                </div>
                <div className="flex items-baseline gap-1">
                   <span className="text-2xl font-black text-gray-900">{selectedTour.tourFee}</span>
                   <span className="text-sm font-black text-gray-900 uppercase">TK</span>
                   <span className="text-xs text-gray-400 font-bold ml-1 uppercase">/ Experience</span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-500 font-medium leading-relaxed px-4">
                  View authentic photos, guide profile, and complete details to secure your spot.
                </p>
                <Link
                  href={`/tours/${selectedTour.slug || selectedTour._id}`}
                  onClick={() => setShowBookingModal(false)}
                  className="w-full flex items-center justify-center py-4 bg-[#4088FD] text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-100"
                >
                  Confirm Details & Book
                </Link>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 text-sm font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                  Change Mind
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}