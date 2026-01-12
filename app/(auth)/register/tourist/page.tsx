"use client";

import { GalleryVerticalEnd, ArrowLeft, Star, Camera, Globe } from "lucide-react";
import { SignupForm } from "@/components/signup-form";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TouristRegisterPage() {
  return (
    <div className="flex min-h-screen bg-white selection:bg-blue-100 overflow-hidden">
      {/* Visual Section - Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-gray-900 via-gray-900/40 to-transparent" />
        
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Traveler Background"
        />

        <div className="relative z-20 flex flex-col justify-between p-16 w-full h-full">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="bg-[#4088FD] text-white flex size-10 items-center justify-center rounded-2xl shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">LocalLens</span>
          </Link>

          <div className="max-w-md">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
             >
                <div className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full w-fit mb-6">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Join as Traveler</p>
                </div>
                <h2 className="text-5xl font-black text-white leading-[1.1] mb-6">
                   Explore the world like a <span className="text-[#4088FD]">local.</span>
                </h2>
                <div className="space-y-6">
                   <div className="flex items-center gap-4 text-white/80 group">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#4088FD] transition-colors">
                        <Camera className="w-5 h-5" />
                      </div>
                      <p className="font-bold">Capture authentic moments</p>
                   </div>
                   <div className="flex items-center gap-4 text-white/80 group">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#4088FD] transition-colors">
                        <Globe className="w-5 h-5" />
                      </div>
                      <p className="font-bold">Connect with local communities</p>
                   </div>
                </div>
             </motion.div>
          </div>

          <div className="flex items-center justify-between text-white/40 text-sm font-bold">
             <p>© 2024 LocalLens Inc.</p>
             <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">Safety</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
             </div>
          </div>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 relative overflow-y-auto">
        <Link 
          href="/" 
          className="absolute top-8 left-8 lg:left-auto lg:right-16 flex items-center gap-2 text-sm font-black text-gray-400 hover:text-gray-900 transition-colors group z-30"
        >
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
           Back to Home
        </Link>
        
        <div className="w-full max-w-[420px] mx-auto py-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-10 lg:hidden text-center flex flex-col items-center">
              <div className="bg-[#4088FD] text-white flex size-12 items-center justify-center rounded-2xl mb-4 shadow-xl shadow-blue-500/20">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <h1 className="text-3xl font-black text-gray-900">Start Exploring</h1>
            </div>

            <div className="hidden lg:block mb-8">
              <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Create Account</h1>
              <p className="text-gray-500 font-bold">Join our community of travelers today.</p>
            </div>

            <SignupForm role="tourist" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

