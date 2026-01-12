'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Users, ExternalLink, CreditCard, ChevronRight } from 'lucide-react';
import { useGetMyBookingsQuery, useInitiatePaymentMutation } from '@/redux/features/booking/booking.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'FAILED';
type PaymentStatus = 'PAID' | 'UNPAID' | 'CANCELLED' | 'FAILED' | 'REFUNDED';

const getStatusStyles = (status: BookingStatus) => {
  switch (status) {
    case 'PENDING': return 'bg-amber-50 text-amber-600';
    case 'CONFIRMED': return 'bg-blue-50 text-[#4088FD]';
    case 'COMPLETED': return 'bg-emerald-50 text-emerald-600';
    case 'CANCELLED': return 'bg-rose-50 text-rose-600';
    default: return 'bg-gray-50 text-gray-600';
  }
};

const getPaymentStyles = (status: PaymentStatus | string) => {
  switch (status) {
    case 'PAID': return 'bg-emerald-50 text-emerald-600';
    case 'UNPAID': return 'bg-amber-50 text-amber-600';
    default: return 'bg-gray-50 text-gray-600';
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

  const statuses: { label: string; value: BookingStatus | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-blue-50 border-t-[#4088FD] animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Syncing your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center max-w-lg mx-auto">
          <p className="text-rose-600 font-bold">{(error as any)?.data?.message || 'Connection lost.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
              <Calendar className="w-5 h-5" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Booking History</h1>
          </div>
          <p className="text-gray-500 font-medium ml-1">Manage your past and upcoming travel experiences.</p>
        </div>

        <Link href="/explore-tours" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-[#4088FD] transition-all text-sm">
          Explore More <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => setActiveTab(status.value)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === status.value ? 'bg-white text-[#4088FD] shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {status.label}
            <span className="ml-2 py-0.5 px-2 bg-gray-100 text-[10px] rounded-full">
              {status.value === 'ALL' ? allBookings.length : allBookings.filter((b: any) => b.status === status.value).length}
            </span>
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#4088FD]">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No {activeTab.toLowerCase()} bookings</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium mb-6">Start exploring amazing Bangladeshi experiences!</p>
          <Link href="/explore-tours" className="inline-flex items-center px-8 py-3 bg-[#4088FD] text-white rounded-xl font-black hover:bg-blue-600 transition-all">
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tour</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((booking: any) => {
                  const tour = booking.tourId || {};
                  const payment = booking.payment || {};
                  const paymentStatus = payment.status || 'UNPAID';
                  
                  return (
                    <tr key={booking._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img className="w-12 h-12 rounded-xl object-cover" src={tour.images?.[0] || 'https://via.placeholder.com/48'} alt={tour.title} />
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 truncate max-w-[200px]">{tour.title}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {tour.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-sm">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" /> {booking.numberOfGuests} Guests</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-gray-900">{booking.totalAmount} TK</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusStyles(booking.status)}`}>{booking.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getPaymentStyles(paymentStatus)}`}>{paymentStatus}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link href={`/tours/${tour._id}`} className="p-2 bg-blue-50 text-[#4088FD] rounded-lg hover:bg-blue-100 transition-colors" title="View Tour">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          {booking.status === 'CONFIRMED' && paymentStatus === 'UNPAID' && (
                            <button onClick={() => handlePayment(booking._id)} disabled={isPaying} className="px-4 py-2 bg-[#4088FD] text-white rounded-lg font-bold text-xs hover:bg-blue-600 transition-colors flex items-center gap-1.5 disabled:opacity-50">
                              <CreditCard className="w-3.5 h-3.5" /> Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
