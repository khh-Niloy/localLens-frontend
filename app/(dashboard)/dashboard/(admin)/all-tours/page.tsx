'use client';

import { MapPin, Eye, Briefcase, Globe, Loader2 } from 'lucide-react';
import { useGetAllToursForAdminQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { motion, AnimatePresence } from 'framer-motion';
import TourCard from '@/components/TourCard';

export default function AllToursPage() {
  const { data: userData } = useGetMeQuery({});
  const { data: toursData, isLoading, error } = useGetAllToursForAdminQuery({}, {
    skip: !userData || userData.role !== 'ADMIN'
  });

  const tours = toursData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#4088FD] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center">
          <p className="text-red-600 font-bold">Failed to load tours. Please try again.</p>
        </div>
      </div>
    );
  }

  const totalStats = {
    totalTours: tours.length,
    activeTours: tours.filter((t: any) => t.status === 'ACTIVE').length,
  };

  return (
    <div className="p-8 space-y-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Tours</h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium ml-1"
          >
            Monitor and manage all experiences across the platform.
          </motion.p>
        </div>

        {/* Stats Overview */}
        <div className="flex gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[200px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Tours</p>
              <p className="text-2xl font-black text-gray-900">{totalStats.totalTours}</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[200px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active</p>
              <p className="text-2xl font-black text-green-600">{totalStats.activeTours}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Grid */}
      <AnimatePresence mode="popLayout">
        {tours.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Tours in Database</h3>
            <p className="text-gray-500">When guides create tours, they will appear here.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tours.map((tour: any, index: number) => (
              <motion.div
                key={tour._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <TourCard 
                  tour={tour} 
                  userData={userData}
                  onBook={() => {}} // Admin doesn't book
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
