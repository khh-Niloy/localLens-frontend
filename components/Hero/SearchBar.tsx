"use client";

import { MapPin, Search, Compass } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useGetAllToursQuery, useGetTourEnumsQuery } from "@/redux/features/tour/tour.api";

export default function SearchBar() {
  const router = useRouter();
  const { data: toursData } = useGetAllToursQuery({});
  const { data: enumsResponse } = useGetTourEnumsQuery(undefined);
  
  const [location, setLocation] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const categories = enumsResponse?.data?.categories || [];
  const tours = toursData?.data || [];
  const uniqueDestinations: string[] = Array.from(
    new Set(tours.map((tour: any) => tour.location).filter(Boolean))
  ).sort() as string[];

  const handleSearch = () => {
    let query = "/explore-tours?";
    if (location !== "all") query += `location=${location}&`;
    if (category !== "all") query += `category=${category}&`;
    router.push(query);
  };

  return (
    <div className="w-full max-w-2xl mt-4 sm:mt-6 md:mt-8 z-50 mx-auto px-2 sm:px-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full p-2 shadow-2xl flex flex-col md:flex-row md:items-center gap-2 md:gap-0 border border-white/20">
        
        {/* Destination Select */}
        <div className="flex-1 w-full md:w-auto">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="!h-auto w-full border-none bg-transparent hover:bg-gray-50 transition-colors cursor-pointer rounded-xl md:rounded-l-full md:rounded-r-none py-3 px-4 sm:px-5 focus:ring-0 focus:ring-offset-0 [&>svg]:hidden">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#4088FD] shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col items-start min-w-0 text-left">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">Destination</span>
                  <span className="text-sm font-semibold text-gray-800 truncate leading-tight">
                    <SelectValue placeholder="All Regions" />
                  </span>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
              <SelectItem value="all" className="rounded-lg">All Regions</SelectItem>
              {uniqueDestinations.map((dest) => (
                <SelectItem key={dest} value={dest} className="rounded-lg">{dest}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:block w-px h-10 bg-gray-200 mx-1"></div>

        {/* Experience Type Select */}
        <div className="flex-1 w-full md:w-auto">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="!h-auto w-full border-none bg-transparent hover:bg-gray-50 transition-colors cursor-pointer rounded-xl md:rounded-none py-3 px-4 sm:px-5 focus:ring-0 focus:ring-offset-0 [&>svg]:hidden">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#4088FD] shrink-0">
                  <Compass size={18} />
                </div>
                <div className="flex flex-col items-start min-w-0 text-left">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">Experience</span>
                  <span className="text-sm font-semibold text-gray-800 truncate leading-tight">
                    <SelectValue placeholder="All Types" />
                  </span>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
              <SelectItem value="all" className="rounded-lg">All Types</SelectItem>
              {categories.map((cat: string) => (
                <SelectItem key={cat} value={cat} className="rounded-lg">
                  {cat.charAt(0) + cat.slice(1).toLowerCase().replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleSearch}
          className="w-full md:w-auto bg-[#4088FD] hover:bg-blue-600 text-white rounded-xl sm:rounded-full px-4 sm:pl-6 sm:pr-2 py-2 flex items-center justify-center md:justify-start gap-3 transition-all group shrink-0 shadow-lg shadow-blue-200"
        >
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap">Find My Adventure</span>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center text-[#4088FD] group-hover:scale-105 transition-transform shrink-0">
            <Search size={18} strokeWidth={3} />
          </div>
        </button>

      </div>
    </div>
  );
}