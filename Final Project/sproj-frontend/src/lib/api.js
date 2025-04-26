import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper to determine if we're in development
const isDevelopment = import.meta.env.MODE === 'development' || window.location.hostname === 'localhost';

const baseQuery = fetchBaseQuery({
  baseUrl: isDevelopment 
    ? 'http://localhost:8000/api'
    : '/.netlify/functions/simple-proxy/api',
  prepareHeaders: async (headers, { getState, endpoint }) => {
    // Only add auth header for endpoints that require it
    if (endpoint === 'createProduct' || endpoint === 'getOrder') {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    headers.set('Cache-Control', 'no-cache');
    return headers;
  },
  credentials: 'include'
});

// Log the current environment and base URL
console.log('API Configuration:', {
  mode: import.meta.env.MODE,
  isDevelopment,
  baseUrl: isDevelopment ? 'http://localhost:8000/api' : '/.netlify/functions/simple-proxy/api'
});

export const api = createApi({
  baseQuery,
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => 'products',
      validateStatus: (response, result) => {
        if (response.status !== 200) {
          console.error('Products API error:', {
            status: response.status,
            statusText: response.statusText,
            data: result,
            timestamp: new Date().toISOString()
          });
        }
        return response.status === 200;
      },
      retry: (failureCount, error) => {
        console.log('Products API retry attempt:', {
          failureCount,
          error: error?.data || error,
          timestamp: new Date().toISOString()
        });
        if (failureCount < 3) {
          return true;
        }
        return false;
      }
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}`,
      validateStatus: (response, result) => {
        if (response.status !== 200) {
          console.error('Product API error:', {
            status: response.status,
            statusText: response.statusText,
            data: result,
            timestamp: new Date().toISOString()
          });
        }
        return response.status === 200;
      },
      retry: (failureCount, error) => {
        console.log('Product API retry attempt:', {
          failureCount,
          error: error?.data || error,
          timestamp: new Date().toISOString()
        });
        if (failureCount < 3) {
          return true;
        }
        return false;
      }
    }),
    getCategories: builder.query({
      query: () => 'categories',
      validateStatus: (response, result) => {
        if (response.status !== 200) {
          console.error('Categories API error:', {
            status: response.status,
            statusText: response.statusText,
            data: result,
            timestamp: new Date().toISOString()
          });
        }
        return response.status === 200;
      },
      retry: (failureCount, error) => {
        console.log('Categories API retry attempt:', {
          failureCount,
          error: error?.data || error,
          timestamp: new Date().toISOString()
        });
        if (failureCount < 3) {
          return true;
        }
        return false;
      }
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: 'products',
        method: 'POST',
        body: data
      })
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: 'orders',
        method: 'POST',
        body: order
      })
    }),
    getOrder: builder.query({
      query: (orderId) => `orders/${orderId}`
    })
  })
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useCreateOrderMutation,
  useGetOrderQuery
} = api;
