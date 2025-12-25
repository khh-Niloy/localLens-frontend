"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, useGetMeQuery, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hooks";
import { ArrowUpRight, Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavbarDemo() {
  const { data: meData } = useGetMeQuery(undefined);
  const me = meData as any;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      dispatch(authApi.util.resetApiState());
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Role-based navigation items (excluding auth actions)
  const getNavItems = () => {
    if (!me) {
      return [
        { name: "Home", link: "/" },
        { name: "Explore Tours", link: "/explore-tours" },
        { name: "Become a Guide", link: "/register/guide" },
      ];
    }

    switch (me.role?.toLowerCase()) {
      case "tourist":
        return [
          { name: "Home", link: "/" },
          { name: "Explore", link: "/explore-tours" },
          { name: "My Bookings", link: "/dashboard/my-bookings" },
          { name: "Profile", link: "/profile" },
        ];
      case "guide":
        return [
          { name: "Home", link: "/" },
          { name: "Explore Tours", link: "/explore-tours" },
          { name: "Dashboard", link: "/dashboard" },
          { name: "Profile", link: "/profile" },
        ];
      case "admin":
        return [
          { name: "Home", link: "/" },
          { name: "Explore Tours", link: "/explore-tours" },
          { name: "Dashboard", link: "/dashboard" },
          { name: "Profile", link: "/profile" },
        ];
      default:
        return [
          { name: "Home", link: "/" },
          { name: "Explore", link: "/explore-tours" },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 w-full"      )}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 py-4 md:py-6">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-2 shadow-lg group-hover:scale-110 transition-transform">
            <Image
              src="/logo-icon.svg"
              alt="Local Lens"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="text-white font-black text-2xl tracking-tighter uppercase italic">
            LOCAL LENS
          </span>
        </Link>

        {/* Middle: Navigation Routes */}
        <div className={cn(
          "hidden lg:flex items-center backdrop-blur-md p-1 rounded-full border border-white/20 transition-all duration-300",
          isScrolled ? "bg-[#4088FD]" : "bg-black/50"
        )}>
          {navItems.map((item) => {
            const isActive = pathname === item.link;
            return (
              <Link
                key={item.link}
                href={item.link}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                  isActive
                    ? "bg-white text-black shadow-lg"
                    : "text-white hover:bg-white/10"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right: Login/Register (Styled like 'Plan Your Trip') */}
        <div className="hidden md:block">
          {!me ? (
            <Link
              href="/login"
              className=" rounded-full flex items-center gap-2 font-medium text-base transition-all duration-200 group "
            >
              <span className="border bg-white border-blue/20 px-4 py-1.5 rounded-full">Login</span>
              <div className="bg-[#4088FD] w-8 h-8 rounded-full flex items-center justify-center text-white group-hover:rotate-45 duration-200 transition-transform">
                <ArrowUpRight size={18} strokeWidth={3} />
              </div>
            </Link>
          ) : (

            <button
              onClick={handleLogout}
              className="rounded-full flex items-center gap-2 font-medium text-base transition-all duration-200 group"
            >
              <span className="border bg-white border-blue/20 px-4 py-1.5 rounded-full">Logout</span>
              <div className="bg-[#fc5151] w-8 h-8 rounded-full flex items-center justify-center text-white group-hover:rotate-45 duration-200 transition-transform">
                <ArrowUpRight size={22} strokeWidth={3} />
              </div>
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#4088FD] border-t border-white/10 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {navItems.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "text-xl font-bold p-2 transition-all",
                pathname === item.link ? "text-white translate-x-2" : "text-white/60 hover:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="h-[1px] bg-white/10 my-2" />
          {!me ? (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-white text-black py-4 rounded-2xl font-black text-center text-lg shadow-xl"
            >
              Login / Register
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-white text-black py-4 rounded-2xl font-black text-center text-lg shadow-xl"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

