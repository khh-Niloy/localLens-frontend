'use client';

import React, { useState } from 'react';
import { useGetUsersByRoleQuery } from '@/redux/features/user/user.api';
import Image from 'next/image';

export default function ManageUsers() {
  const [activeTab, setActiveTab] = useState<'TOURIST' | 'GUIDE'>('TOURIST');
  
  const { data: touristsData, isLoading: touristsLoading } = useGetUsersByRoleQuery('TOURIST');
  const { data: guidesData, isLoading: guidesLoading } = useGetUsersByRoleQuery('GUIDE');
  
  const currentData = activeTab === 'TOURIST' ? touristsData : guidesData;
  const isLoading = activeTab === 'TOURIST' ? touristsLoading : guidesLoading;
  const users = currentData?.data || [];
  const count = currentData?.meta || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('TOURIST')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'TOURIST'
                ? 'border-b-2 border-[#1FB67A] text-[#1FB67A]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tourists ({activeTab === 'TOURIST' ? count : touristsData?.meta || 0})
          </button>
          <button
            onClick={() => setActiveTab('GUIDE')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'GUIDE'
                ? 'border-b-2 border-[#1FB67A] text-[#1FB67A]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Guides ({activeTab === 'GUIDE' ? count : guidesData?.meta || 0})
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                All {activeTab === 'TOURIST' ? 'Tourists' : 'Guides'}
              </h2>
              <div className="text-sm text-gray-600">
                Total: {count}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-12 text-center text-gray-500">Loading...</div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No {activeTab === 'TOURIST' ? 'tourists' : 'guides'} found.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user: any) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-500">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive === 'ACTIVE' && !user.isBlocked
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isBlocked ? 'Blocked' : user.isActive}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
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
