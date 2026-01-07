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
      className="bg-white overflow-hidden transition-all duration-500 group relative cursor-pointer"
    >
      <Link href={`/tours/${tour._id}`} className="block">
        {/* Tour Image */}
        <div className="relative h-44 overflow-hidden rounded-xl">
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
          
          <div className="absolute top-4 left-4 bg-white/75 backdrop-blur-md text-gray-900 px-3 py-1 rounded-lg text-[10px] font-semibold shadow-sm z-10">
            {tour.category || 'Experience'}
          </div>
        </div>

        {/* Tour Details */}
        <div className="pt-3.5">
          <div className="flex items-start justify-left mb-0.5">
            <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-1 group-hover:text-[#4088FD] transition-colors duration-300">
              {tour.title}
            </h3>
          </div>

          <div className="flex items-center text-gray-500 text-[10px] mt-1.5 mb-1.5 gap-3">
            <div className='flex items-center'>
              <MapPin className="w-3 h-3 mr-1 text-[#4088FD]" />
            <span className="truncate">{tour.location}</span>
            </div>

            <div className='flex items-center gap-1'>
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold ">Rating</span>
              <span className="text-[10px] font-bold text-gray-900">{tour.rating}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 block font-medium tracking-tighter">Price starts at {tour.tourFee} TK</span>
          </div>
        </div>
      </Link>

      {/* Wishlist Button - kept outside Link but inside relative container */}
      <div className="absolute top-4 right-4 z-20">
        <WishlistButton tourId={tour._id} />
      </div>
    </motion.div>
  );
};

export default TourCard;
