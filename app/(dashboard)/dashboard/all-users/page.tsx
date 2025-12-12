import React from 'react';

export default function AllUsersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
        <p className="text-gray-600">Manage and view all users in the system</p>
      </div>
      
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">User Management</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search users..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
              />
              <button className="bg-[#1FB67A] text-white px-4 py-2 rounded-md hover:bg-[#1dd489] transition-colors">
                Add User
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="p-8 text-center">
            <p className="text-gray-500">No users found.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

