"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, MapPin, Calendar, Users, MessageCircle, Award, Globe } from 'lucide-react';

interface Profile {
  name: string;
  location: string;
  joinedDate: string;
  bio: string;
  languages?: string[];
  role: 'guide' | 'tourist';
  stats: {
    rating?: number;
    reviewCount?: number;
    toursGiven?: number;
    responseRate?: number;
    responseTime?: string;
    tripsCompleted?: number;
    reviewsWritten?: number;
    countriesVisited?: number;
  };
  activeListings?: Array<{
    id: string;
    title: string;
    rating: number;
    reviewCount: number;
    price: number;
  }>;
  reviews?: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
    tourTitle: string;
  }>;
  reviewsWritten?: Array<{
    id: string;
    tourTitle: string;
    guideName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

// TODO: Replace with actual API call to get user profile
const getUserProfile = (id: string): Profile | null => {
  // This should be replaced with actual API call
  return null;
};

export default function ProfilePage() {
  const params = useParams();
  const profileId = params.id as string;
  const [activeTab, setActiveTab] = useState('overview');
  
  const profile = getUserProfile(profileId);
  
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

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

  const renderGuideProfile = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-gray-600">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            
            <div className="flex items-center gap-4 mb-4 text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{profile.bio}</p>
            
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                Languages: {profile.languages?.join(', ')}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                {renderStars(profile.stats.rating || 0)}
                <span className="font-semibold">{profile.stats.rating || 0}</span>
                <span className="text-gray-600">({profile.stats.reviewCount || 0} reviews)</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{profile.stats.toursGiven}</span> tours given
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-[#1FB67A]">{profile.stats.toursGiven}</div>
          <div className="text-sm text-gray-600">Tours Given</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-[#1FB67A]">{profile.stats.rating}/5</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-[#1FB67A]">{profile.stats.responseRate}%</div>
          <div className="text-sm text-gray-600">Response Rate</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-[#1FB67A]">{profile.stats.responseTime}</div>
          <div className="text-sm text-gray-600">Response Time</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b">
          <nav className="flex">
            {['overview', 'listings', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-[#1FB67A] text-[#1FB67A]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">About {profile.name}</h3>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.languages?.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Tours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.activeListings?.map((listing) => (
                  <div key={listing.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
                    <h4 className="font-semibold mb-2">{listing.title}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {renderStars(listing.rating)}
                        <span className="text-sm text-gray-600">({listing.reviewCount})</span>
                      </div>
                      <span className="font-bold text-[#1FB67A]">${listing.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Reviews</h3>
              <div className="space-y-4">
                {profile.reviews?.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.author}</span>
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700 mb-1">{review.comment}</p>
                    <p className="text-sm text-gray-500">Tour: {review.tourTitle}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTouristProfile = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-gray-600">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
            
            <div className="flex items-center gap-4 mb-4 text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{profile.bio}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-[#1FB67A]">{profile.stats.tripsCompleted}</div>
          <div className="text-sm text-gray-600">Trips Completed</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-[#1FB67A]">{profile.stats.reviewsWritten}</div>
          <div className="text-sm text-gray-600">Reviews Written</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-[#1FB67A]">{profile.stats.countriesVisited}</div>
          <div className="text-sm text-gray-600">Countries Visited</div>
        </div>
      </div>

      {/* Reviews Written */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold mb-4">Reviews Written</h3>
        <div className="space-y-4">
          {profile.reviewsWritten?.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{review.tourTitle}</h4>
                  <p className="text-sm text-gray-600">Guide: {review.guideName}</p>
                </div>
                <div className="text-right">
                  {renderStars(review.rating)}
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {profile.role === 'guide' ? renderGuideProfile() : renderTouristProfile()}
    </div>
  );
}

