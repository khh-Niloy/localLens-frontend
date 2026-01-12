import { baseApi } from "../../baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's wishlist
    getWishlist: builder.query({
      query: () => ({
        url: "/wishlist",
        method: "GET",
      }),
      providesTags: ["wishlist"],
    }),

    // Add tour to wishlist
    addToWishlist: builder.mutation({
      query: (tourId) => ({
        url: "/wishlist",
        method: "POST",
        data: { tourId },
      }),
      invalidatesTags: ["wishlist"],
    }),

    // Remove tour from wishlist
    removeFromWishlist: builder.mutation({
      query: (tourId) => ({
        url: `/wishlist/${tourId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
