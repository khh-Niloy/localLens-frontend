"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, useGetMeQuery, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hooks";

export function NavbarDemo() {
  const { data: meData } = useGetMeQuery(undefined);
  const me = meData as any;
  
  // Role-based navigation items
  const getNavItems = () => {
    if (!me) {
      // Logged out navigation
      return [
        { name: "Home", link: "/" },
        { name: "Explore Tours", link: "/explore-tours" },
        { name: "Become a Guide", link: "/register/guide" },
        { name: "Login", link: "/login" },
        { name: "Register", link: "/register/tourist" },
      ];
    }

    // Role-specific items
    switch (me.role?.toLowerCase()) {
      case 'tourist':
        return [
          { name: "Home", link: "/" },
          { name: "Explore Tours", link: "/explore-tours" },
          { name: "My Bookings", link: "/dashboard/my-bookings" },
          { name: "Profile", link: "/profile" },
          { name: "Logout", link: "#", isAction: true },
        ];
      case 'guide':
        return [
          { name: "Home", link: "/" },
          { name: "Explore Tours", link: "/explore-tours" },
          { name: "Dashboard", link: "/dashboard" },
          { name: "Profile", link: "/profile" },
          { name: "Logout", link: "#", isAction: true },
        ];
      case 'admin':
        return [
          { name: "Home", link: "/" },
          { name: "Admin Dashboard", link: "/dashboard" },
          { name: "Manage Users", link: "/dashboard/all-users" },
          { name: "Manage Listings", link: "/dashboard/all-tours" },
          { name: "Profile", link: "/profile" },
          { name: "Logout", link: "#", isAction: true },
        ];
      default:
        return [
          { name: "Home", link: "/" },
          { name: "Explore Tours", link: "/explore-tours" },
        ];
    }
  };

  const navItems = getNavItems();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
    router.push('/');
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: string,
    isAction?: boolean
  ) => {
    e.preventDefault();

    // Handle logout action - check if link is "#" or if isAction flag is set
    if ((isAction || link === "#") && me) {
      handleLogout();
      setIsMobileMenuOpen(false);
      return;
    }

    if (link.startsWith("/")) {
      router.push(link);
      setIsMobileMenuOpen(false);
      return;
    }

    const targetId = link.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} onItemClick={handleNavClick} />
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={(e) => handleNavClick(e, item.link, (item as any).isAction)}
                className="relative text-white"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
