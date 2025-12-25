'use client';

import React, { useState } from 'react';
import { useGetAllToursQuery } from '@/redux/features/tour/tour.api';
import TourCard from './TourCard';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

interface CategoryToursProps {
  userData: any;
  handleBookTour: (tour: any) => void;
}

const categories = [
  { id: 'FOOD', label: 'Food' },
  { id: 'HISTORICAL', label: 'Historical' },
  { id: 'ART', label: 'Art' },
  { id: 'NATURE', label: 'Nature' },
  { id: 'ADVENTURE', label: 'Adventure' },
  { id: 'CULTURAL', label: 'Cultural' },
];

export default function CategoryTours({ userData, handleBookTour }: CategoryToursProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  
  const { data: toursData, isLoading, error } = useGetAllToursQuery({ 
    category: activeCategory 
  });

  const tours = toursData?.data.slice(0, 8) || [];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
          <div className="w-full flex flex-col items-center justify-center">
            <h4 className="text-[#4088FD] font-bold tracking-widest uppercase text-sm mb-3">Our Collections</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Adventure based on your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4088FD] to-blue-600">Interests</span>
            </h2>

             <div className="flex gap-3 mt-5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-[#4088FD] text-white shadow-xl shadow-blue-200 scale-105'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
          </div>
          
         

        <motion.div 
          layout
          className="relative min-h-[400px] mt-16"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-gray-100 border-t-[#4088FD] rounded-full animate-spin mb-4 shadow-inner"></div>
                  <p className="text-gray-400 font-medium animate-pulse">Finding perfect tours...</p>
                </div>
              </motion.div>
            ) : tours.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No {activeCategory.toLowerCase()} tours yet</h3>
                <p className="text-gray-500 max-w-xs">We couldn't find any experiences in this category. Check back later!</p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {tours.map((tour: any, index: number) => (
                  <motion.div
                    key={tour._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
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
        </motion.div>
      </div>
      <div className="text-center mt-12">
                            <Link 
                              href="/explore-tours"
                              className="inline-block bg-[#4088FD] text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-lg shadow-blue-100"
                            >
                              View All Experiences
                            </Link>
                          </div>
    </section>
  );
}
