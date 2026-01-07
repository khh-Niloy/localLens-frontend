"use client";

import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useGetLatestReviewsQuery } from "@/redux/features/review/review.api";

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: reviews = [], isLoading } = useGetLatestReviewsQuery({ limit: 6 });

  // Map backend data to local structure
  const formattedReviews = reviews.map((r: any) => ({
    id: r._id,
    name: r.userId?.name || "Local Explorer",
    role: "Verified Guest",
    image: r.userId?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    content: r.comment,
    rating: r.rating,
    location: r.tourId?.location || "Bangladesh"
  }));

  const nextReview = () => {
    if (formattedReviews.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % formattedReviews.length);
  };

  const prevReview = () => {
    if (formattedReviews.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + formattedReviews.length) % formattedReviews.length);
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 text-[#4088FD] animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Explorer Stories...</p>
      </div>
    );
  }

  if (formattedReviews.length === 0) {
    return null;
  }

  const activeReview = formattedReviews[activeIndex];

  return (
    <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-[#F8FAFC] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h4 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#4088FD] font-black tracking-[0.3em] uppercase text-xs mb-4"
          >
            Testimonials
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight"
          >
            What our <span className="text-[#4088FD]">explorers</span> say
          </motion.h2>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Gallery Side */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative">
                <motion.div 
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
                >
                  <img 
                    src={activeReview.image} 
                    alt={activeReview.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-multiply" />
                </motion.div>
                
                {/* Decorative dots/shapes */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#4088FD]/10 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl" />
                
                <div className="absolute -right-4 bottom-12 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 z-20">
                   <div className="flex gap-1">
                     {[...Array(activeReview.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />)}
                   </div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">100% Verified</p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-7">
              <div className="bg-white p-10 sm:p-16 rounded-[3.5rem] shadow-xl shadow-blue-500/5 relative border border-gray-50">
                <Quote className="absolute top-10 right-10 w-16 h-16 text-blue-50/50" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8 lg:hidden">
                    <img 
                      src={activeReview.image} 
                      className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                    />
                    <div>
                      <h4 className="font-black text-gray-900">{activeReview.name}</h4>
                      <p className="text-xs text-[#4088FD] font-bold uppercase tracking-widest">{activeReview.role}</p>
                    </div>
                  </div>

                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-xl sm:text-2xl font-bold text-gray-800 leading-relaxed italic mb-10">
                      "{activeReview.content}"
                    </p>
                    
                    <div className="hidden lg:block mb-10">
                      <h4 className="text-2xl font-black text-gray-900 mb-1">{activeReview.name}</h4>
                      <p className="text-sm text-[#4088FD] font-bold uppercase tracking-[0.2em]">{activeReview.role}</p>
                      <p className="text-xs text-gray-400 font-bold mt-1 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-amber-400" /> 
                        {activeReview.location}
                      </p>
                    </div>
                  </motion.div>

                  <div className="flex items-center gap-6">
                    <div className="flex gap-3">
                      <button 
                        onClick={prevReview}
                        className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-[#4088FD] hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={nextReview}
                        className="w-14 h-14 rounded-2xl bg-gray-900 border border-gray-900 text-white flex items-center justify-center hover:bg-[#4088FD] hover:border-[#4088FD] transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="flex-1 h-px bg-gray-100" />
                    
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Story</p>
                      <p className="text-lg font-black text-gray-900">0{activeIndex + 1} <span className="text-gray-200">/</span> 0{formattedReviews.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
