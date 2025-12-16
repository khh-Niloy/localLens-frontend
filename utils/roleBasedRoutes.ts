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
          title: "All Bookings",
          url: "/dashboard/all-bookings",
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
      title: "Booking Management",
      url: "#",
      items: [
        {
          title: "All Bookings",
          url: "/dashboard/all-bookings",
        },
        {
          title: "Pending Bookings",
          url: "/dashboard/pending-bookings",
        },
      ],
    },
    {
      title: "My Trips",
      url: "/dashboard/my-trips",
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
