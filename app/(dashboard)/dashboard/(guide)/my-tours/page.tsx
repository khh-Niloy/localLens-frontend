'use client';

import { MapPin, Loader2, Plus, Edit, Trash2, Settings, Briefcase, Users } from 'lucide-react';
import { useGetGuideMyToursQuery, useUpdateTourMutation } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyToursPage() {
  const { data: userData } = useGetMeQuery({});
  const userRole = userData?.role;

  const { data: guideToursData, isLoading: guideToursLoading, error: guideToursError } = useGetGuideMyToursQuery(undefined, {
    skip: userRole !== 'GUIDE'
  });

  const [updateTour, { isLoading: isUpdating }] = useUpdateTourMutation();

  const handleToggleFeatured = async (tourId: string, currentFeatured: boolean) => {
    try {
      const newFeatured = !currentFeatured;
      await updateTour({ id: tourId, isFeatured: newFeatured }).unwrap();
      toast.success(newFeatured ? 'Tour added to featured' : 'Tour removed from featured');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update featured status');
    }
  };
  
  const tours: any[] = userRole === 'GUIDE' 
    ? (guideToursData?.data || []) 
    : [];
  
  const isLoading = userRole === 'GUIDE' ? guideToursLoading : false;
  const error = userRole === 'GUIDE' ? guideToursError : null;
  
  const totalTours = tours.length;
  const activeTours = tours.filter(tour => tour.status === 'ACTIVE').length;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-blue-50 border-t-[#4088FD] animate-spin" />
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#4088FD] animate-pulse" />
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Loading your experiences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center">
          <p className="text-red-600 font-bold">{(error as any)?.data?.message || 'Failed to load tours. Please try again.'}</p>
        </div>
      </div>
    );
  }

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
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Experiences</h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium ml-1"
          >
            Manage and showcase your professional tour listings.
          </motion.p>
        </div>

        <div className="flex flex-wrap gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[180px]"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Total</p>
              <p className="text-xl font-black text-gray-900">{totalTours}</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[180px]"
          >
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Active</p>
              <p className="text-xl font-black text-green-600">{activeTours}</p>
            </div>
          </motion.div>

          <Link 
            href="/dashboard/create-tour"
            className="bg-[#4088FD] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-blue-100"
          >
            <Plus className="w-5 h-5" />
            Create New
          </Link>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {tours.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 shadow-blue-100/10"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <Briefcase className="w-10 h-10 text-[#4088FD]" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No Tours Created Yet</h3>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed">
              Start your journey as a guide by creating your first amazing experience for tourists!
            </p>
            <Link 
              href="/dashboard/create-tour"
              className="inline-flex items-center px-8 py-4 bg-[#4088FD] text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-100"
            >
              <Plus className="w-6 h-6 mr-2" />
              Create Your First Tour
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tours.map((tour, index) => (
              <motion.div
                key={tour._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col"
              >
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
                  {/* Tour Card Content */}
                  <div className="p-2 flex-1 flex flex-col">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                       <img 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          src={tour.images?.[0] || 'https://via.placeholder.com/400x300'} 
                          alt={tour.title} 
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900">
                           {tour.status}
                        </div>
                    </div>
                    
                    <div className="px-3 pb-4 space-y-3 flex-1">
                      <h3 className="font-black text-gray-900 text-lg leading-tight line-clamp-2">{tour.title}</h3>
                      <div className="flex items-center text-gray-400 font-bold text-xs gap-3">
                         <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#4088FD]" />
                            {tour.location}
                         </span>
                         <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#4088FD]" />
                            Max {tour.maxGroupSize}
                         </span>
                      </div>
                      <div className="text-xl font-black text-[#4088FD]">
                        {tour.tourFee} <span className="text-xs uppercase tracking-tighter">TK</span>
                      </div>
                    </div>
                  </div>

                  {/* Guide Actions Bar */}
                  <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                       <Link 
                          href={`/dashboard/edit-tour/${tour._id}`}
                          className="w-9 h-9 flex items-center justify-center bg-white rounded-xl text-gray-500 hover:text-[#4088FD] transition-colors border border-gray-100 shadow-sm"
                          title="Edit Experience"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          className="w-9 h-9 flex items-center justify-center bg-white rounded-xl text-gray-500 hover:text-red-500 transition-colors border border-gray-100 shadow-sm"
                          title="Delete Experience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Featured</span>
                       <button
                          onClick={() => handleToggleFeatured(tour._id, tour.isFeatured)}
                          disabled={isUpdating}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-50 ${
                            tour.isFeatured ? 'bg-[#4088FD]' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                              tour.isFeatured ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                          {isUpdating && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-full">
                              <Loader2 className="w-3 h-3 animate-spin text-white" />
                            </div>
                          )}
                        </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
