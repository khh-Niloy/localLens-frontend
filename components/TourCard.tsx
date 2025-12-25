import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import WishlistButton from '@/components/ui/WishlistButton';
import { motion } from 'framer-motion';

interface TourCardProps {
  tour: any;
  userData: any;
  onBook: (tour: any) => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, userData, onBook }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group relative"
    >
      {/* Tour Image */}
      <div className="relative h-44 overflow-hidden">
        {tour.images && tour.images[0] ? (
          <img 
            src={tour.images[0]} 
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 font-sans"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-200" />
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 right-4 z-10">
          <WishlistButton tourId={tour._id} />
        </div>

        {tour.isFeatured && (
          <div className="absolute top-4 left-4 bg-[#4088FD] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-widest z-10">
            Featured
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 rounded-lg text-xs font-semibold shadow-sm z-10">
          {tour.category || 'Experience'}
        </div>
      </div>

      {/* Tour Details */}
      <div className="p-3.5">
        <div className="flex items-start justify-between mb-0.5">
          <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-1 group-hover:text-[#4088FD] transition-colors duration-300">
            {tour.title}
          </h3>
        </div>

        <div className="flex items-center text-gray-500 text-[10px] mb-1.5">
          <MapPin className="w-3 h-3 mr-1 text-[#4088FD]" />
          <span className="truncate">{tour.location}</span>
        </div>

        <p className="text-gray-500 text-[11px] mb-3 line-clamp-2 leading-tight">
          {tour.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <div className="flex flex-col items-center justify-center p-1 bg-gray-50 rounded-lg group-hover:bg-[#4088FD]/5 transition-colors duration-300">
            <Clock className="w-3 h-3 mb-0.5 text-[#4088FD]" />
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Duration</span>
            <span className="text-[10px] font-bold text-gray-900">{tour.maxDuration}h</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1 bg-gray-50 rounded-lg group-hover:bg-[#4088FD]/5 transition-colors duration-300">
            <Users className="w-3 h-3 mb-0.5 text-[#4088FD]" />
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Guests</span>
            <span className="text-[10px] font-bold text-gray-900">Max {tour.maxGroupSize}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1 bg-gray-50 rounded-lg group-hover:bg-[#4088FD]/5 transition-colors duration-300">
            <Star className="w-3 h-3 mb-0.5 text-amber-400 fill-amber-400" />
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Rating</span>
            <span className="text-[10px] font-bold text-gray-900">{tour.rating || 4.8}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-tighter mb-0">Price starts at</span>
            <div className="flex items-baseline">
              <span className="text-base font-black text-gray-900">{tour.tourFee}</span>
              <span className="text-[10px] font-bold text-gray-900 ml-0.5">TK</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Link 
              href={`/tours/${tour.slug || tour._id}`}
              className="px-3 py-2 flex items-center justify-center rounded-xl hover:bg-[#3471D1] bg-[#4088FD] text-white transition-all duration-300 text-[10px] font-bold uppercase tracking-wider"
            >
              Details
            </Link>
            
            {userData && userData.role === 'TOURIST' ? (
              <button 
                onClick={() => onBook(tour)}
                className="bg-[#4088FD] text-white px-4 py-2 rounded-xl hover:bg-[#3471D1] transition-all duration-300 font-bold text-xs shadow-lg shadow-[#4088FD]/20"
              >
                Book
              </button>
            ) : !userData ? (
              <Link 
                href="/login"
                className="bg-[#4088FD] text-white px-4 py-2 rounded-xl hover:bg-[#3471D1] transition-all duration-300 font-bold text-xs shadow-lg shadow-[#4088FD]/20"
              >
                Book
              </Link>
            ) : (
              <button 
                disabled
                className="bg-gray-100 text-gray-400 px-4 py-2 rounded-xl cursor-not-allowed font-bold text-xs"
              >
                Book
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;
