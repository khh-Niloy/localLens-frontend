import React from 'react';

export default function MyBookings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>
        <p className="text-gray-600 mb-8">
          View and manage your upcoming and past tour bookings.
        </p>
        
        <div className="space-y-6">
          {/* Upcoming Bookings */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Bookings</h2>
            <div className="bg-white rounded-lg shadow-md border p-6">
              <p className="text-gray-500 text-center py-8">No upcoming bookings found.</p>
            </div>
          </div>

          {/* Past Bookings */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Past Bookings</h2>
            <div className="bg-white rounded-lg shadow-md border p-6">
              <p className="text-gray-500 text-center py-8">No past bookings found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

