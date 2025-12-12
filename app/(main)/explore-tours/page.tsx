'use client';

import React, { useState } from 'react';
import { useGetAllToursQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import WishlistButton from '@/components/ui/WishlistButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Search,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function ExploreToursPage() {
  const { data: toursData, isLoading } = useGetAllToursQuery({});
  const { data: userData } = useGetMeQuery({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);

  const tours = toursData?.data || [];

  // Filter tours based on search and filters
  const filteredTours = tours.filter((tour: any) => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || tour.category === selectedCategory;
    
    const matchesPrice = (!priceRange.min || tour.tourFee >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || tour.tourFee <= parseFloat(priceRange.max));
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ['CULTURAL', 'FOOD', 'HISTORICAL', 'ADVENTURE', 'NATURE', 'ART'];

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

    setSelectedTour(tour);
    setShowBookingModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1FB67A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1FB67A] to-[#1dd489] text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Amazing Tours
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover unique experiences curated by passionate local guides around the world
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tours, locations, or experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center mb-4">
            <SlidersHorizontal className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="$1000"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setPriceRange({ min: '', max: '' });
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredTours.length} Tour{filteredTours.length !== 1 ? 's' : ''} Found
          </h2>
          <div className="text-sm text-gray-600">
            Showing {filteredTours.length} of {tours.length} tours
          </div>
        </div>

        {/* Tours Grid */}
        {filteredTours.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setPriceRange({ min: '', max: '' });
              }}
              className="bg-[#1FB67A] text-white px-6 py-3 rounded-lg hover:bg-[#1dd489] transition-colors"
            >
              View All Tours
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour: any) => (
              <div key={tour._id} className="bg-white rounded-lg shadow-lg border overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  {tour.images && tour.images.length > 0 ? (
                    <img 
                      src={tour.images[0]} 
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3">
                    <WishlistButton tourId={tour._id} />
                  </div>
                  
                  {tour.originalPrice && tour.originalPrice > tour.tourFee && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Save ${tour.originalPrice - tour.tourFee}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{tour.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{tour.description}</p>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{tour.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{tour.maxDuration}h</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Max {tour.maxGroupSize}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                      <span>{tour.rating || 4.8}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-[#1FB67A]">${tour.tourFee}</span>
                      {tour.originalPrice && tour.originalPrice > tour.tourFee && (
                        <span className="text-sm text-gray-500 line-through ml-2">${tour.originalPrice}</span>
                      )}
                      <div className="text-xs text-gray-600">per person</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {tour.guideId?.name || 'Local Guide'}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link 
                      href={`/tours/${tour.slug || tour._id}`}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium text-sm"
                    >
                      View Details
                    </Link>
                    {userData && userData.role === 'TOURIST' ? (
                      <button 
                        onClick={() => handleBookTour(tour)}
                        className="flex-1 bg-[#1FB67A] text-white py-2 px-4 rounded-lg hover:bg-[#1dd489] transition-colors font-medium text-sm"
                      >
                        Book Now
                      </button>
                    ) : !userData ? (
                      <Link 
                        href="/login"
                        className="flex-1 bg-[#1FB67A] text-white py-2 px-4 rounded-lg hover:bg-[#1dd489] transition-colors text-center font-medium text-sm"
                      >
                        Login to Book
                      </Link>
                    ) : (
                      <button 
                        disabled
                        className="flex-1 bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed font-medium text-sm"
                        title="Only tourists can book tours"
                      >
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredTours.length > 0 && filteredTours.length < tours.length && (
          <div className="text-center mt-12">
            <button className="bg-[#1FB67A] text-white px-8 py-3 rounded-lg hover:bg-[#1dd489] transition-colors font-medium">
              Load More Tours
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        {selectedTour && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book Your Experience</DialogTitle>
              <DialogDescription>
                View full tour details to complete your booking
              </DialogDescription>
            </DialogHeader>
            
            {/* Tour Summary */}
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 text-sm mb-1">{selectedTour.title}</h4>
              <div className="flex items-center text-xs text-gray-600 mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{selectedTour.location}</span>
              </div>
              <div className="text-base font-bold text-[#1FB67A]">${selectedTour.tourFee} per person</div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Click "View Details" to see the full tour information and complete your booking.
              </p>
              <Link
                href={`/tours/${selectedTour.slug || selectedTour._id}`}
                onClick={() => setShowBookingModal(false)}
                className="inline-block bg-[#1FB67A] text-white px-6 py-3 rounded-lg hover:bg-[#1dd489] transition-colors font-medium"
              >
                View Full Details & Book
              </Link>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}