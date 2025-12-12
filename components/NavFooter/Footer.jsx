"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
          {/* Left: Logo and Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 mb-2 group">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-400 rounded"></div>
              </div>
              <div>
                <span className="font-bold text-gray-900 text-lg">LocalLens</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 mt-1">Experiences made easy.</p>
          </div>

          {/* Right: Navigation Columns */}
          <div className="flex flex-col sm:flex-row gap-8 md:gap-12">
            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <nav className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/explore-tours"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Explore Tours
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Become a Guide
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
              </nav>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <nav className="flex flex-col gap-3">
                <Link
                  href="/explore-tours"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Browse Tours
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign Up
                </Link>
                <a
                  href="mailto:support@locallens.com"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Help Center
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright and Legal */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © LocalLens {currentYear}
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
