import React from 'react';

export default function ExploreTours() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Tours</h1>
        <p className="text-gray-600 mb-8">
          Discover amazing local experiences and book tours with experienced guides.
        </p>
        
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tours available at the moment.</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for new tour listings!</p>
        </div>
      </div>
    </div>
  );
}

