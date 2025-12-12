const routes = {
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
      title: "Listing Management",
      url: "#",
      items: [
        {
          title: "All Listings",
          url: "/dashboard/all-listings",
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
          title: "Upcoming Bookings",
          url: "/dashboard/guide-upcoming-bookings",
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
      title: "My Trips",
      url: "#",
      items: [
        {
          title: "Upcoming Bookings",
          url: "/dashboard/upcoming-bookings",
        },
        {
          title: "Past Bookings",
          url: "/dashboard/past-bookings",
        },
      ],
    },
    {
      title: "Wishlist",
      url: "/dashboard/wishlist",
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
    },
  ],
};

export const roleBasedRoutes = ({ role }: { role: string }) => {
  return routes[role as keyof typeof routes] || [];
};
