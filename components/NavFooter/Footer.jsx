"use client";

import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center mb-4 group">
              <div className="flex items-center">
                <span className="text-xl font-black tracking-tight">
                  <span className="text-gray-900">Local</span>
                  <span className="text-[#4088FD]">Lens</span>
                </span>
                <div className="w-1.5 h-1.5 bg-[#4088FD] rounded-full ml-1 group-hover:scale-150 transition-transform"></div>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
              Discover authentic local experiences with passionate guides. 
              Explore hidden gems and create unforgettable memories across Bangladesh.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin size={16} className="text-[#4088FD]" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#4088FD] mb-5">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-[#4088FD] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/explore-tours"
                className="text-sm text-gray-600 hover:text-[#4088FD] transition-colors"
              >
                Explore Tours
              </Link>
              <Link
                href="/register/guide"
                className="text-sm text-gray-600 hover:text-[#4088FD] transition-colors"
              >
                Become a Guide
              </Link>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-[#4088FD] transition-colors"
              >
                Login
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#4088FD] mb-5">Get in Touch</h3>
            <nav className="flex flex-col gap-3">
              <a
                href="mailto:hello@locallens.com"
                className="text-sm text-gray-600 hover:text-[#4088FD] transition-colors flex items-center gap-2"
              >
                <Mail size={14} />
                hello@locallens.com
              </a>
              <a
                href="tel:+8801234567890"
                className="text-sm text-gray-600 hover:text-[#4088FD] transition-colors flex items-center gap-2"
              >
                <Phone size={14} />
                +880 1234 567890
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              © {currentYear} LocalLens. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-xs text-gray-400 hover:text-[#4088FD] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-xs text-gray-400 hover:text-[#4088FD] transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
