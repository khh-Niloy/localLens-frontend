export interface IRoleRoute {
  title: string;
  url: string;
  items?: {
    title: string;
    url: string;
  }[];
}

const routes: Record<string, IRoleRoute[]> = {
  admin: [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "User Management",
      url: "#",
      items: [
        {
          title: "All Users",
          url: "/dashboard/all-users",
        },
      ],
    },
    {
      title: "Tour Management",
      url: "#",
      items: [
        {
          title: "All Tours",
          url: "/dashboard/all-tours",
        },
      ],
    },
    {
      title: "Booking Management",
      url: "#",
      items: [
        {
          title: "All Bookings",
          url: "/dashboard/all-bookings",
        },
      ],
    },
  ],
  guide: [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Tour Management",
      url: "#",
      items: [
        {
          title: "Create Tour",
          url: "/dashboard/create-tour",
        },
        {
          title: "My Tours",
          url: "/dashboard/my-tours",
        },
      ],
    },
    {
      title: "Booking Management",
      url: "#",
      items: [
        {
          title: "Pending Bookings",
          url: "/dashboard/pending-bookings",
        },
        {
          title: "My Bookings",
          url: "/dashboard/guide-bookings",
        },
      ],
    },
  ],
  tourist: [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "My Bookings",
      url: "/dashboard/my-bookings",
    },
    {
      title: "My Completed Tours",
      url: "/dashboard/my-trips",
    },
    {
      title: "Wishlist",
      url: "/dashboard/wishlist",
    },
  ],
};

export const roleBasedRoutes = ({ role }: { role: string }) => {
  return routes[role] || [];
};
