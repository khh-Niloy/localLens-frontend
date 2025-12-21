"use client"

import * as React from "react"
import {
  Users,
  MapPin,
  Calendar,
  BookOpen,
  BarChart3,
  Plus,
  List,
  Clock,
  CheckCircle,
  User,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useGetMeQuery } from "@/redux/features/auth/auth.api"
import { roleBasedRoutes, IRoleRoute } from "@/utils/roleBasedRoutes"

// Icon mapping for role-based routes
const iconMap: Record<string, any> = {
  "Home": Home,
  "User Management": Users,
  "Tour Management": BookOpen,
  "Listing Management": MapPin, // Keeping for safety
  "Booking Management": Calendar,
  "My Completed Tours": Calendar,
  "Browse Tours": MapPin,
  "Wishlist": BookOpen,
  "Profile": User,
  "All Users": Users,
  "All Listings": List,
  "All Tours": List, // Added
  "All Bookings": Calendar,
  "My Bookings": Calendar,
  "Create Tour": Plus,
  "My Tours": List,
  "Upcoming Bookings": Clock,
  "Pending Bookings": CheckCircle,
  "Past Bookings": BarChart3,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: meData } = useGetMeQuery(undefined);
  const me = meData as any;

  // Get role-based routes and transform them for sidebar
  const roleRoutes: IRoleRoute[] = me ? roleBasedRoutes({ role: me.role?.toLowerCase() || 'tourist' }) : [];
  
  const sidebarData = {
    navMain: roleRoutes.map(route => ({
      title: route.title,
      url: route.url === "#" ? "#" : route.url,
      icon: iconMap[route.title] || BookOpen,
      isActive: false,
      items: route.items?.map(item => ({
        title: item.title,
        url: item.url,
      })) || [],
    })),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
