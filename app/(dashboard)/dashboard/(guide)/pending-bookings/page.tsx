'use client';

import React from 'react';
import { Calendar, MapPin, Users, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import { useGetPendingBookingsQuery, useGetMyBookingsQuery, useUpdateBookingStatusMutation } from '@/redux/features/booking/booking.api';
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

export default function PendingBookingsPage() {
  const { data: userData } = useGetMeQuery({});
  const isGuide = userData?.role === 'GUIDE';
  const isTourist = userData?.role === 'TOURIST';
  
  const { data: guideBookingsData, isLoading: isLoadingGuide, error: errorGuide } = useGetPendingBookingsQuery({}, { 
    skip: !isGuide 
  });
  
  const { data: touristBookingsData, isLoading: isLoadingTourist, error: errorTourist } = useGetMyBookingsQuery({}, { 
    skip: !isTourist 
  });
  
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const isLoading = isGuide ? isLoadingGuide : isLoadingTourist;
  const error = isGuide ? errorGuide : errorTourist;
  
  const pendingBookings = isGuide
    ? (guideBookingsData?.data || [])
    : (touristBookingsData?.data || []).filter((booking: any) => booking.status === 'PENDING');

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus({ id: bookingId, status: 'CONFIRMED' }).unwrap();
      toast.success('Booking confirmed successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to confirm booking');
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to decline this booking?')) return;
    try {
      await updateBookingStatus({ id: bookingId, status: 'CANCELLED' }).unwrap();
      toast.success('Booking declined');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to decline booking');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-amber-50 border-t-amber-500 animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Retrieving pending requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center max-w-lg mx-auto">
          <p className="text-rose-600 font-bold">Failed to load pending bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock3 className="w-5 h-5" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Pending Approval</h1>
        </div>
        <p className="text-gray-500 font-medium ml-1">
          {isGuide ? 'Review and manage incoming booking requests' : 'Your pending booking requests'}
        </p>
      </div>

      {pendingBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Clear Schedule!</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium">No pending booking requests at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tour</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{isGuide ? 'Tourist' : 'Guide'}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pendingBookings.map((booking: any) => {
                  const tour = booking.tourId || {};
                  const user = isGuide ? (booking.userId || {}) : (booking.guideId || {});
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
                        <div className="flex items-center gap-3">
                          <img className="w-9 h-9 rounded-full object-cover" src={user.image || 'https://via.placeholder.com/36'} alt={user.name} />
                          <div className="font-bold text-gray-900 text-sm">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-sm">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{booking.bookingTime}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-gray-900">{booking.totalAmount} TK</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" /> {booking.numberOfGuests} Guests</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit ${getStatusStyles(booking.status)}`}>{booking.status}</span>
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit ${getPaymentStyles(paymentStatus)}`}>{paymentStatus}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link href={`/tours/${tour.slug || tour._id}`} className="text-[#4088FD] hover:underline text-sm font-bold">View</Link>
                          {isGuide && booking.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleAcceptBooking(booking._id)} disabled={isUpdating} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50" title="Accept">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeclineBooking(booking._id)} disabled={isUpdating} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50" title="Decline">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
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
