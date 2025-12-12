'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');
  const statusParam = searchParams.get('status');

  useEffect(() => {
    if (statusParam === 'success' && transactionId) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  }, [statusParam, transactionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#1FB67A] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your booking has been confirmed. The guide will review and accept your booking request.
          </p>
          
          {transactionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-1">Transaction ID:</p>
              <p className="font-mono text-sm text-gray-900">{transactionId}</p>
              {amount && (
                <>
                  <p className="text-sm text-gray-600 mb-1 mt-3">Amount Paid:</p>
                  <p className="text-lg font-bold text-[#1FB67A]">${amount}</p>
                </>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/dashboard/upcoming-bookings"
              className="block w-full bg-[#1FB67A] text-white px-6 py-3 rounded-lg hover:bg-[#1dd489] transition-colors font-medium"
            >
              View My Bookings
            </Link>
            <Link
              href="/explore-tours"
              className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse More Tours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          There was an issue processing your payment. Please try again.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/explore-tours"
            className="block w-full bg-[#1FB67A] text-white px-6 py-3 rounded-lg hover:bg-[#1dd489] transition-colors font-medium"
          >
            Try Again
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
