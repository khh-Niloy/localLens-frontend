"use client";
import { SignupForm } from "@/components/signup-form";

export default function TouristRegisterPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Join as a Tourist</h1>
          <p className="text-sm text-gray-600 mt-2">
            Discover amazing local experiences and book tours with local guides
          </p>
        </div>
        <SignupForm role="tourist" />
      </div>
    </div>
  );
}

