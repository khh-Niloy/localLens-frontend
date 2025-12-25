import { ChevronDown, CircleDollarSign, MapPin, Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="w-full max-w-xl mt-8 z-60 mx-auto">
            <div className="bg-white rounded-full p-2 shadow-2xl flex flex-col md:flex-row items-center gap-2 md:gap-0">
              
              {/* Location */}
              <div className="flex-1 flex items-center gap-2 px-4 py-0.5 border-r border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer rounded-l-full">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 font-bold text-gray-800 text-xs">
                    Location <ChevronDown size={12} />
                  </div>
                  <p className="text-gray-400 text-[10px]">Enter destination</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex-1 flex items-center gap-2 px-4 py-0.5 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <CircleDollarSign size={16} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 font-bold text-gray-800 text-xs">
                    Price <ChevronDown size={12} />
                  </div>
                  <p className="text-gray-400 text-[10px]">Enter budget</p>
                </div>
              </div>

              {/* Action Button */}
              <button className="bg-[#4088FD] hover:bg-blue-600 text-white rounded-full pl-5 pr-1 py-1 flex items-center gap-3 transition-all group shrink-0">
                <span className="font-bold text-sm">Find My Adventure</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shrink-0">
                  <Search size={16} strokeWidth={3} />
                </div>
              </button>

            </div>
          </div>
    )
}