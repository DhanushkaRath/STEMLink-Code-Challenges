// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const isDev = process.env.NODE_ENV === "development";
const baseUrl = isDev
  ? "http://localhost:8000/api/"
  : "https://fed-storefront-backend-dhanushka.onrender.com/api/";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers, { getState }) => {
      try {
        const token = await window.Clerk?.session?.getToken();
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('Error fetching Clerk token:', error);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "products",
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}`,
    }),
    getCategories: builder.query({
      query: () => "categories",
    }),
    createProduct: builder.mutation({
      query: ({ data }) => {
        const token = window.Clerk?.session?.getToken();
        return {
          url: "products",
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        };
      },
    }),
    createOrder: builder.mutation({
      query: (orderData) => {
        const token = window.Clerk?.session?.getToken();
        return {
          url: "orders",
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: orderData,
        };
      },
    }),
    getOrder: builder.query({
      query: ({ orderId }) => ({
        url: `orders/${orderId}`,
        headers: {
          Authorization: `Bearer ${window.Clerk?.session?.getToken()}`,
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useCreateOrderMutation,
  useGetOrderQuery,
} = api;