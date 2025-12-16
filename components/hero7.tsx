'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Hero7Props {
  userData?: any;
  className?: string;
}

export function Hero7({ userData, className }: Hero7Props) {
  return (
    <section className={cn("relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-5 md:mb-6">
            Discover Local Experiences with{' '}
            <span className="text-[#1FB67A]">LocalLens</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-7 md:mb-8 max-w-2xl mx-auto px-4">
            Connect with local guides and discover authentic experiences in your destination. 
            Book unique tours, cultural experiences, and hidden gems.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            {userData ? (
              <>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#1FB67A] hover:bg-[#1dd489] text-white px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base w-full sm:w-auto"
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#1FB67A] text-[#1FB67A] hover:bg-[#1FB67A] hover:text-white px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base w-full sm:w-auto"
                >
                  <Link href="/explore-tours">
                    Explore Tours
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#1FB67A] hover:bg-[#1dd489] text-white px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base w-full sm:w-auto"
                >
                  <Link href="/explore-tours">
                    Explore Tours
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#1FB67A] text-[#1FB67A] hover:bg-[#1FB67A] hover:text-white px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base w-full sm:w-auto"
                >
                  <Link href="/register/guide">
                    Become a Guide
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

