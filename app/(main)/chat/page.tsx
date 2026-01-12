"use client";

import React from "react";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useGetMyConnectionQuery } from "@/redux/features/chat/chat.api";
import { Loader2, MessageSquare, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ChatPage() {
  const { data: user } = useGetMeQuery({});
  const {
    data: connectionsResponse,
    isLoading,
    error,
  } = useGetMyConnectionQuery(user?._id, {
    skip: !user?._id,
  });

  const connections = connectionsResponse?.data || [];
  // console.log(connections);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load connections. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-blue-500" />
        My Connections
      </h1>

      <div className="grid gap-4">
        {connections.length > 0 ? (
          connections.map((connection: any) => (
            <Link href={`/chat/${connection._id}`}>
              <div
                key={connection._id}
                className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {connection.companion.image ? (
                      <Image
                        src={connection.companion.image}
                        alt={connection.companion.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500">
                        <UserIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {connection.companion.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">
              No connections yet. Book a tour to start a conversation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
