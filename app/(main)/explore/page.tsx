"use client";
import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Clock, Users, DollarSign, Calendar, Grid, List, Map } from 'lucide-react';
import Link from 'next/link';

// TODO: Replace with actual API call to get tours
const mockTours: any[] = [];

export default function ExplorePage() {
  const [tours, setTours] = useState(mockTours);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 200],
    duration: 'all',
    rating: 0,
    maxGroupSize: 'all',
    availableDate: ''
  });

  // Filter and search logic
  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tour.guide.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || tour.category === filters.category;
    const matchesPrice = tour.price >= filters.priceRange[0] && tour.price <= filters.priceRange[1];
    const matchesRating = tour.rating >= filters.rating;
    
    let matchesDuration = true;
    if (filters.duration !== 'all') {
      const duration = tour.duration;
      switch (filters.duration) {
        case 'short': matchesDuration = duration <= 2; break;
        case 'medium': matchesDuration = duration > 2 && duration <= 4; break;
        case 'long': matchesDuration = duration > 4; break;
      }
    }
    
    let matchesGroupSize = true;
    if (filters.maxGroupSize !== 'all') {
      const size = tour.maxGroupSize;
      switch (filters.maxGroupSize) {
        case 'small': matchesGroupSize = size <= 6; break;
        case 'medium': matchesGroupSize = size > 6 && size <= 12; break;
        case 'large': matchesGroupSize = size > 12; break;
      }
    }
    
    const matchesDate = !filters.availableDate || tour.availableDates.includes(filters.availableDate);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesDuration && matchesGroupSize && matchesDate;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderTourCard = (tour: any) => (
    <div key={tour.id} className="bg-white rounded-lg shadow border hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
        <span className="text-gray-500">Tour Image</span>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{tour.title}</h3>
          <span className="text-lg font-bold text-[#1FB67A]">${tour.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold">
            {tour.guide.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{tour.guide.name}</p>
            <div className="flex items-center gap-1">
              {renderStars(tour.guide.rating)}
              <span className="text-xs text-gray-600">({tour.guide.reviewCount})</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{tour.duration}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Max {tour.maxGroupSize}</span>
          </div>
          <div className="flex items-center gap-1">
            {renderStars(tour.rating)}
            <span>({tour.reviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          {tour.highlights.slice(0, 2).map((highlight: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {highlight}
            </span>
          ))}
          {tour.highlights.length > 2 && (
            <span className="text-xs text-gray-500">+{tour.highlights.length - 2} more</span>
          )}
        </div>
        
        <Link
          href={`/tours/${tour.id}`}
          className="w-full bg-[#1FB67A] text-white py-2 px-4 rounded-md hover:bg-[#1dd489] transition-colors text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  const renderTourList = (tour: any) => (
    <div key={tour.id} className="bg-white rounded-lg shadow border hover:shadow-lg transition-shadow p-4">
      <div className="flex gap-4">
        <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-gray-500 text-sm">Image</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{tour.title}</h3>
            <span className="text-lg font-bold text-[#1FB67A]">${tour.price}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{tour.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{tour.duration}h</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Max {tour.maxGroupSize}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(tour.rating)}
              <span>({tour.reviewCount})</span>
            </div>
            <span>by {tour.guide.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tour.highlights.slice(0, 3).map((highlight: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {highlight}
                </span>
              ))}
            </div>
            
            <Link
              href={`/tours/${tour.id}`}
              className="bg-[#1FB67A] text-white py-1 px-4 rounded-md hover:bg-[#1dd489] transition-colors text-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Tours</h1>
        <p className="text-gray-600">Discover amazing local experiences with expert guides</p>
      </div>

      {/* Search and View Controls */}
      <div className="bg-white rounded-lg shadow border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tours, guides, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[#1FB67A] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-[#1FB67A] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 ${viewMode === 'map' ? 'bg-[#1FB67A] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Found {filteredTours.length} tours
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow border p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
                  >
                    <option value="all">All Categories</option>
                    <option value="food">Food & Drink</option>
                    <option value="historical">Historical</option>
                    <option value="art">Art & Culture</option>
                    <option value="nature">Nature</option>
                    <option value="adventure">Adventure</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                    className="w-full"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters({...filters, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
                  >
                    <option value="all">Any Duration</option>
                    <option value="short">Short (≤ 2 hours)</option>
                    <option value="medium">Medium (2-4 hours)</option>
                    <option value="long">Long (> 4 hours)</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters({...filters, rating: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
                  >
                    <option value="0">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                {/* Group Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Size</label>
                  <select
                    value={filters.maxGroupSize}
                    onChange={(e) => setFilters({...filters, maxGroupSize: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
                  >
                    <option value="all">Any Size</option>
                    <option value="small">Small (≤ 6 people)</option>
                    <option value="medium">Medium (6-12 people)</option>
                    <option value="large">Large (> 12 people)</option>
                  </select>
                </div>

                {/* Available Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Date</label>
                  <input
                    type="date"
                    value={filters.availableDate}
                    onChange={(e) => setFilters({...filters, availableDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
                  />
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => setFilters({
                    category: 'all',
                    priceRange: [0, 200],
                    duration: 'all',
                    rating: 0,
                    maxGroupSize: 'all',
                    availableDate: ''
                  })}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {viewMode === 'map' ? (
            <div className="bg-white rounded-lg shadow border p-8 text-center">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Map View</h3>
              <p className="text-gray-600">Interactive map showing tour locations will be displayed here.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredTours.map(tour => viewMode === 'grid' ? renderTourCard(tour) : renderTourList(tour))}
            </div>
          )}

          {filteredTours.length === 0 && (
            <div className="bg-white rounded-lg shadow border p-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tours found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find more tours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

