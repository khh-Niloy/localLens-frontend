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
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useGetMeQuery } from "@/redux/features/auth/auth.api"
import { roleBasedRoutes } from "@/utils/roleBasedRoutes"

// Icon mapping for role-based routes
const iconMap: Record<string, any> = {
  "Home": Home,
  "User Management": Users,
  "Listing Management": MapPin,
  "Booking Management": Calendar,
  "Tour Management": BookOpen,
  "My Trips": MapPin,
  "All Users": Users,
  "All Listings": List,
  "All Bookings": Calendar,
  "Create Tour": Plus,
  "My Tours": List,
  "Upcoming Bookings": Clock,
  "Pending Bookings": CheckCircle,
  "Upcoming Trips": Clock,
  "Past Trips": BarChart3,
  "Wishlist Trips": BookOpen,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: meData } = useGetMeQuery(undefined);
  const me = meData as any;

  // Get role-based routes and transform them for sidebar
  const roleRoutes = me ? roleBasedRoutes({ role: me.role?.toLowerCase() || 'tourist' }) : [];
  
  const sidebarData = {
  user: {
      name: me?.name || "User",
      email: me?.email || "user@example.com",
      avatar: "/avatars/user.jpg",
  },
  teams: [
    {
        name: "Local Lens",
        logo: MapPin,
        plan: me?.role || "Tourist",
    },
  ],
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
  projects: [
    {
        name: "Profile",
        url: "/profile",
        icon: User,
    },
  ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavProjects projects={sidebarData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
