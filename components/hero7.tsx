"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, CircleDollarSign, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import SearchBar from "./Hero/SearchBar";

interface Hero7Props {
  userData?: any;
  className?: string;
}

const slides = [
  {
    image: "/view-delicious-appetizing-street-food.jpg",
    subtitle: "TASTE THE LOCAL",
    heading: "FOOD",
  },
  {
    image: "/hut-rice-field-thailand.jpg",
    subtitle: "ESCAPE INTO",
    heading: "NATURE",
  },
  {
    image: "/pexels-tanhatamannasyed-34957301.jpg",
    subtitle: "DISCOVER THE",
    heading: "HISTORY",
  },
  {
    image: "/pexels-adreyat-2852395.jpg",
    subtitle: "SEEK THE",
    heading: "ADVENTURE",
  },
];


const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=3387&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=3534&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=3461&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export function Hero7({ className }: Hero7Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className={cn(
        "relative min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] lg:min-h-[95vh] flex items-center justify-center overflow-hidden bg-white",
        className
      )}
    >
      {/* Background Images Layer */}
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide].image}
              alt="Slider Background"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center">
        <div className="w-full max-w-[90rem] mx-auto text-center flex flex-col items-center px-2 sm:px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium tracking-[0.2em] sm:tracking-[0.3em] text-white/90 mb-2 sm:mb-3 md:mb-4 uppercase drop-shadow-md">
                {slides[currentSlide].subtitle}
              </span>

              <h1 className="text-[11vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] xl:text-[140px] tracking-[-0.02em] leading-[0.85] text-white uppercase mb-4 sm:mb-6 md:mb-8 drop-shadow-2xl font-kaushan">
                {slides[currentSlide].heading}
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Adventure Search Bar */}
          <SearchBar/>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={cn(
              "h-1 transition-all duration-300 rounded-full",
              currentSlide === idx ? "w-8 sm:w-10 md:w-12 bg-white" : "w-4 sm:w-5 md:w-6 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </section>
  );
}

