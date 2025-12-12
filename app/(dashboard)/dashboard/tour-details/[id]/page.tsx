'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetMyToursQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { ArrowLeft, MapPin, Clock, Users, Calendar, Star, CheckCircle, XCircle, Info } from 'lucide-react';
import Link from 'next/link';

interface Tour {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  tourFee: number;
  originalPrice?: number;
  status: string;
  images: string[];
  createdAt: string;
  maxGroupSize: number;
  maxDuration: number;
  location: string;
  meetingPoint: string;
  category: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  importantInfo: string[];
  cancellationPolicy?: string;
  itinerary: Array<{
    time: string;
    title: string;
    description: string;
    location?: string;
  }>;
  rating?: number;
  reviewCount?: number;
  bookingCount?: number;
}

export default function TourDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.id as string;
  
  const { data: myToursData, isLoading: toursLoading, error: toursError } = useGetMyToursQuery({});
  const { data: userData } = useGetMeQuery({});
  
  const tours: Tour[] = myToursData?.data || [];
  const tour = tours.find(t => t._id === tourId);
  const userRole = userData?.role;

  if (toursLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (toursError || !tour) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Tour not found</h3>
          <p className="text-red-600 text-sm mt-1">
            The tour you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link 
            href="/dashboard/my-tours"
            className="inline-block mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            ← Back to My Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Tours
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{tour.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {tour.location}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {tour.maxDuration} hours
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Max {tour.maxGroupSize} guests
              </div>
              <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                tour.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {tour.status}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#1FB67A]">${tour.tourFee}</div>
            {tour.originalPrice && tour.originalPrice > tour.tourFee && (
              <div className="text-sm text-gray-500 line-through">${tour.originalPrice}</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {tour.images && tour.images.length > 0 && (
            <div className="bg-white rounded-lg shadow border overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={tour.images[0]} 
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {tour.images.length > 1 && (
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {tour.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square relative rounded overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${tour.title} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold mb-4">About This Tour</h2>
            <p className="text-gray-700 mb-4">{tour.description}</p>
            {tour.longDescription && (
              <p className="text-gray-700">{tour.longDescription}</p>
            )}
          </div>

          {/* Highlights */}
          {tour.highlights && tour.highlights.length > 0 && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="text-lg font-semibold mb-4">Tour Highlights</h2>
              <ul className="space-y-2">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Itinerary */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="text-lg font-semibold mb-4">Itinerary</h2>
              <div className="space-y-4">
                {tour.itinerary.map((item, index) => (
                  <div key={index} className="border-l-2 border-[#1FB67A] pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{item.time}</span>
                      <span className="text-gray-600">- {item.title}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{item.description}</p>
                    {item.location && (
                      <div className="flex items-center mt-1">
                        <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{item.location}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's Included/Not Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tour.included && tour.included.length > 0 && (
              <div className="bg-white rounded-lg shadow border p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-700">What's Included</h3>
                <ul className="space-y-2">
                  {tour.included.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tour.notIncluded && tour.notIncluded.length > 0 && (
              <div className="bg-white rounded-lg shadow border p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-700">What's Not Included</h3>
                <ul className="space-y-2">
                  {tour.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Important Information */}
          {tour.importantInfo && tour.importantInfo.length > 0 && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Important Information</h3>
              <ul className="space-y-2">
                {tour.importantInfo.map((info, index) => (
                  <li key={index} className="flex items-start">
                    <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cancellation Policy */}
          {tour.cancellationPolicy && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold mb-4">Cancellation Policy</h3>
              <p className="text-gray-700 text-sm">{tour.cancellationPolicy}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tour Stats */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold mb-4">Tour Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{tour.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{tour.maxDuration} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Group Size:</span>
                <span className="font-medium">{tour.maxGroupSize} people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meeting Point:</span>
                <span className="font-medium text-sm">{tour.meetingPoint}</span>
              </div>
              {tour.rating && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{tour.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm ml-1">({tour.reviewCount} reviews)</span>
                  </div>
                </div>
              )}
              {tour.bookingCount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings:</span>
                  <span className="font-medium">{tour.bookingCount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-sm">
                  {new Date(tour.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {userRole === 'GUIDE' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                  Delete Tour
                </button>
                <Link 
                  href="/dashboard/my-tours"
                  className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-center"
                >
                  Back to My Tours
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}