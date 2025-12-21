'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Info, DollarSign } from 'lucide-react';
import { useGetMyBookingsQuery, useInitiatePaymentMutation } from '@/redux/features/booking/booking.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'FAILED';
type PaymentStatus = 'PAID' | 'UNPAID' | 'CANCELLED' | 'FAILED' | 'REFUNDED';

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'FAILED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: PaymentStatus | string) => {
  switch (status) {
    case 'PAID':
      return 'text-green-600 bg-green-50';
    case 'UNPAID':
      return 'text-yellow-600 bg-yellow-50';
    case 'CANCELLED':
      return 'text-red-600 bg-red-50';
    case 'FAILED':
      return 'text-red-600 bg-red-50';
    case 'REFUNDED':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus | 'ALL'>('ALL');
  const { data: userData } = useGetMeQuery({});
  const { data: bookingsData, isLoading, error } = useGetMyBookingsQuery({});
  const [initiatePayment, { isLoading: isPaying }] = useInitiatePaymentMutation();

  const allBookings = bookingsData?.data || [];
  const filteredBookings = activeTab === 'ALL' 
    ? allBookings 
    : allBookings.filter((booking: any) => booking.status === activeTab);

  const statuses: (BookingStatus | 'ALL')[] = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  const handlePayment = async (bookingId: string) => {
    try {
      const response = await initiatePayment(bookingId).unwrap();
      if (response.success && response.data?.paymentUrl) {
          window.location.href = response.data.paymentUrl;
      } else {
          toast.error('Failed to get payment URL');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to initiate payment');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1FB67A]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{(error as any)?.data?.message || 'Failed to load bookings. Please try again.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 font-medium">Manage and track all your booked tours</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === status
                ? 'bg-[#1FB67A] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
            <span className="ml-2 opacity-70">
              ({status === 'ALL' ? allBookings.length : allBookings.filter((b: any) => b.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab.toLowerCase()} bookings</h3>
          <p className="text-gray-500 mb-6">You don't have any bookings with this status.</p>
          <Link
            href="/explore-tours"
            className="inline-block bg-[#1FB67A] text-white px-6 py-2 rounded-md hover:bg-[#1dd489] transition-colors"
          >
            Explore Tours
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tour
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking: any) => {
                const tour = booking.tourId || {};
                const payment = booking.payment || {};
                const paymentStatus = payment.status || 'UNPAID';
                
                return (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-lg object-cover" 
                            src={tour.images?.[0] || 'https://via.placeholder.com/300x200'} 
                            alt={tour.title} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={tour.title}>
                            {tour.title}
                          </div>
                          <div className="text-xs text-gray-500">{tour.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{booking.bookingTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">${booking.totalAmount}</div>
                      <div className="text-xs text-gray-500">{booking.numberOfGuests} Guests</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(paymentStatus)}`}>
                        {paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2 items-center">
                        <Link
                            href={`/tours/${tour.slug || tour._id}`}
                            className="text-[#1FB67A] hover:text-[#1dd489] underline"
                        >
                            View
                        </Link>
                        {booking.status === 'CONFIRMED' && paymentStatus === 'UNPAID' && (
                          <button
                            onClick={() => handlePayment(booking._id)}
                            disabled={isPaying}
                            className="ml-2 px-3 py-1 bg-[#1FB67A] text-white rounded text-xs hover:bg-[#1dd489] transition-colors disabled:opacity-50"
                          >
                            {isPaying ? 'Processing...' : 'Pay'}
                          </button>
                        )}
                         {booking.status === 'PENDING' && (
                              <span className="text-xs text-gray-500 ml-2 italic">Wait for approval</span>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
