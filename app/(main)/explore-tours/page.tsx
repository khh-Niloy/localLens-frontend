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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  MapPin, 
  Search,
  Filter,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

export default function ExploreToursPage() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || '';

  const { data: toursData, isLoading } = useGetAllToursQuery({});
  const { data: enumsResponse } = useGetTourEnumsQuery(undefined);
  const { data: userData } = useGetMeQuery({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDestination, setSelectedDestination] = useState(initialLocation);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);

  const tours = toursData?.data || [];

  // Extract unique destinations and languages from tours
  const uniqueDestinations: string[] = Array.from(new Set(tours.map((tour: any) => tour.location).filter(Boolean))).sort() as string[];

  // Filter tours based on search and filters
  const filteredTours = tours.filter((tour: any) => {
    const matchesSearch = !searchTerm || 
                         tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || tour.category === selectedCategory || selectedCategory === 'all';
    
    const matchesDestination = !selectedDestination || tour.location === selectedDestination || selectedDestination === 'all';
    
    return matchesSearch && matchesCategory && matchesDestination;
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
      <section className="relative overflow-hidden bg-white pt-8 pb-16 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24 lg:pt-24 lg:pb-32 border-b border-gray-100">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-sky-50/50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-[1.1] mb-4 sm:mb-6 tracking-tight"
            >
              Explore Amazing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4088FD] to-blue-600">Experiences</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 md:mb-10 font-medium px-2"
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
                  className="w-full pl-12 sm:pl-16 pr-4 sm:pr-8 py-4 sm:py-5 md:py-6 rounded-2xl sm:rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-blue-100/20 text-sm sm:text-base md:text-lg text-gray-900 outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#4088FD] transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 md:-mt-10 relative z-20 pb-12 sm:pb-16 md:pb-20">
        {/* Filters Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-blue-100/10 border border-white/50 p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 md:mb-16"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
              <Filter className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Refine Discovery</h2>
            <button
               onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedDestination('');
              }}
              className="ml-auto text-xs font-bold uppercase tracking-widest text-[#4088FD] hover:text-blue-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Destination Filter */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Destination</label>
              <Select value={selectedDestination || 'all'} onValueChange={setSelectedDestination}>
                <SelectTrigger className="w-full h-14 bg-gray-50/50 border border-transparent hover:border-blue-100 rounded-2xl px-5 text-sm font-bold text-gray-700 focus:bg-white focus:border-[#4088FD] transition-all outline-none">
                   <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#4088FD]" />
                      <SelectValue placeholder="All Regions" />
                   </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                  <SelectItem value="all" className="rounded-lg">All Regions</SelectItem>
                  {uniqueDestinations.map((destination: string) => (
                    <SelectItem key={destination} value={destination} className="rounded-lg">{destination}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Experience Type</label>
              <Select value={selectedCategory || 'all'} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full h-14 bg-gray-50/50 border border-transparent hover:border-blue-100 rounded-2xl px-5 text-sm font-bold text-gray-700 focus:bg-white focus:border-[#4088FD] transition-all outline-none">
                   <div className="flex items-center gap-3">
                      <Compass className="w-4 h-4 text-[#4088FD]" />
                      <SelectValue placeholder="All Categories" />
                   </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                  <SelectItem value="all" className="rounded-lg">All Categories</SelectItem>
                  {categories.map((category: string) => (
                    <SelectItem key={category} value={category} className="rounded-lg">
                      {category.charAt(0) + category.slice(1).toLowerCase().replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4 mb-6 sm:mb-8 md:mb-10 px-2 sm:px-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              {filteredTours.length} <span className="text-gray-400 text-lg sm:text-xl md:text-2xl font-bold ml-1">Experiences Found</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-widest">
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8"
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