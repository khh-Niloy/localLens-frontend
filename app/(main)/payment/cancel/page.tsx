'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made. You can try again when you're ready.
        </p>
        
        {transactionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Transaction ID:</p>
            <p className="font-mono text-sm text-gray-900">{transactionId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/explore-tours"
            className="block w-full bg-[#4088FD] text-white px-6 py-3 rounded-lg hover:bg-[#357ae8] transition-colors font-medium"
          >
            Continue Browsing
          </Link>
          <Link
            href="/dashboard"
            className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4088FD]"></div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
