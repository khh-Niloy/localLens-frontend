'use client';

import React from 'react';
import { Users, Mail, Phone, Shield, User, MapPin } from 'lucide-react';
import { useGetAllUsersQuery } from '@/redux/features/user/user.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';

export default function AllUsersPage() {
  const { data: userData } = useGetMeQuery({});
  const { data: usersData, isLoading, error } = useGetAllUsersQuery({}, {
    skip: !userData || userData.role !== 'ADMIN'
  });

  const users = usersData?.data || [];

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
          <p className="text-red-800">Failed to load users. Please try again.</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return <Shield className="w-4 h-4" />;
      case 'GUIDE':
        return <MapPin className="w-4 h-4" />;
      case 'TOURIST':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'GUIDE':
        return 'bg-blue-100 text-blue-800';
      case 'TOURIST':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
        <p className="text-gray-600">Manage and view all users in the system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Guides</p>
              <p className="text-xl font-bold text-[#1FB67A]">{users.filter((u: any) => u.role === 'GUIDE').length}</p>
            </div>
            <MapPin className="w-6 h-6 text-[#1FB67A]" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tourists</p>
              <p className="text-xl font-bold text-green-600">{users.filter((u: any) => u.role === 'TOURIST').length}</p>
            </div>
            <User className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-xl font-bold text-purple-600">{users.filter((u: any) => u.role === 'ADMIN').length}</p>
            </div>
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">User Management</h2>
        </div>
        
        <div className="p-6">
          {users.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.image || 'https://via.placeholder.com/40x40'} 
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            {user.address && (
                              <p className="text-sm text-gray-500">{user.address}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {user.phone ? (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
