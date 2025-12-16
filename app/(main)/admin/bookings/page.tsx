'use client';

import React, { useState } from 'react';
import { useGetAllBookingsQuery } from '@/redux/features/booking/booking.api';
import Image from 'next/image';

export default function ManageBookings() {
  const { data, isLoading } = useGetAllBookingsQuery({});
  const bookings = data?.data || [];
  const [selectedTour, setSelectedTour] = useState<string | null>(null);

  // Group bookings by tour
  const bookingsByTour: { [key: string]: any[] } = {};
  bookings.forEach((booking: any) => {
    const tourId = booking.tourId?._id || 'unknown';
    if (!bookingsByTour[tourId]) {
      bookingsByTour[tourId] = [];
    }
    bookingsByTour[tourId].push(booking);
  });

  const tours = Object.keys(bookingsByTour).map(tourId => {
    const tourBookings = bookingsByTour[tourId];
    const firstBooking = tourBookings[0];
    return {
      tourId,
      tour: firstBooking.tourId,
      bookings: tourBookings,
      totalBookings: tourBookings.length,
      totalRevenue: tourBookings
        .filter((b: any) => b.payment?.status === 'PAID')
        .reduce((sum: number, b: any) => sum + (b.payment?.amount || 0), 0),
    };
  });

  const displayBookings = selectedTour
    ? bookingsByTour[selectedTour] || []
    : bookings;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'UNPAID':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Booking Management</h1>
        <p className="text-gray-600 mb-8">
          View and manage all bookings and payments per tour.
        </p>

        {/* Tour Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {tours.map((tourGroup) => (
            <div
              key={tourGroup.tourId}
              onClick={() => setSelectedTour(selectedTour === tourGroup.tourId ? null : tourGroup.tourId)}
              className={`bg-white rounded-lg shadow-md border p-4 cursor-pointer transition ${
                selectedTour === tourGroup.tourId ? 'border-[#1FB67A] border-2' : ''
              }`}
            >
              <div className="flex items-center mb-2">
                {tourGroup.tour?.images?.[0] && (
                  <Image
                    src={tourGroup.tour.images[0]}
                    alt={tourGroup.tour.title}
                    width={48}
                    height={48}
                    className="rounded mr-3 object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {tourGroup.tour?.title || 'Unknown Tour'}
                  </h3>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bookings:</span>
                  <span className="font-medium">{tourGroup.totalBookings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium text-green-600">
                    ${tourGroup.totalRevenue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {selectedTour ? 'Bookings for Selected Tour' : 'All Bookings'}
              </h2>
              {selectedTour && (
                <button
                  onClick={() => setSelectedTour(null)}
                  className="text-sm text-[#1FB67A] hover:underline"
                >
                  Show All
                </button>
              )}
              <div className="text-sm text-gray-600">
                Total: {displayBookings.length}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-12 text-center text-gray-500">Loading...</div>
            ) : displayBookings.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No bookings found.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tourist
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guide
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayBookings.map((booking: any) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {booking.tourId?.images?.[0] && (
                            <Image
                              src={booking.tourId.images[0]}
                              alt={booking.tourId.title}
                              width={40}
                              height={40}
                              className="rounded mr-3 object-cover"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {booking.tourId?.title || 'Unknown Tour'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.tourId?.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.userId ? (
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                              {booking.userId.image ? (
                                <Image
                                  src={booking.userId.image}
                                  alt={booking.userId.name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">
                                  {booking.userId.name?.charAt(0)?.toUpperCase() || 'T'}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.userId.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.userId.email}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.guideId ? (
                          <div className="text-sm text-gray-900">
                            {booking.guideId.name}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.bookingDate)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.bookingTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.numberOfGuests}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${booking.totalAmount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.payment ? (
                          <div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(booking.payment.status)}`}>
                              {booking.payment.status}
                            </span>
                            {booking.payment.transactionId && (
                              <div className="text-xs text-gray-500 mt-1">
                                ID: {booking.payment.transactionId.slice(0, 8)}...
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

