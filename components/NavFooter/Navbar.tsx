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
        { name: "Explore Tours", link: "/explore" },
        { name: "Become a Guide", link: "/register/guide" },
      ];
    }

    // Base items for all logged-in users
    const baseItems = [
      { name: "Home", link: "/" },
        { name: "Explore Tours", link: "/explore" },
    ];

    // Role-specific items
    switch (me.role?.toLowerCase()) {
      case 'tourist':
        return [
          ...baseItems,
          { name: "My Bookings", link: "/my-bookings" },
        ];
      case 'guide':
        return [
          ...baseItems,
          { name: "Dashboard", link: "/dashboard" },
        ];
      case 'admin':
        return [
          { name: "Home", link: "/" },
          { name: "Admin Dashboard", link: "/dashboard" },
          { name: "Manage Users", link: "/admin/users" },
          { name: "Manage Listings", link: "/admin/listings" },
  ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: string
  ) => {
    e.preventDefault();

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

  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
    router.push('/');
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} onItemClick={handleNavClick} />
          <div className="flex items-center gap-4">
            {me ? (
              <>
                <NavbarButton href="/profile" variant="secondary">
                  Profile
                </NavbarButton>
                <NavbarButton
                  onClick={() => handleLogout()}
                  variant="secondary"
                >
                  Logout
                </NavbarButton>
              </>
            ) : (
              <>
              <NavbarButton href="/login" variant="secondary">
                Login
              </NavbarButton>
                <NavbarButton href="/register/tourist" variant="primary">
                  Register
                </NavbarButton>
              </>
            )}
          </div>
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
                onClick={(e) => handleNavClick(e, item.link)}
                className="relative text-white"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {me ? (
                <>
                  <NavbarButton href="/profile" variant="secondary">
                    Profile
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => handleLogout()}
                    variant="secondary"
                  >
                    Logout
                  </NavbarButton>
                </>
              ) : (
                <>
                <NavbarButton href="/login" variant="secondary">
                  Login
                </NavbarButton>
                  <NavbarButton href="/register/tourist" variant="primary">
                    Register
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
