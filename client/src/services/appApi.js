import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// This file exports an instance of the API created with Redux to handle HTTP requests.

// createApi creates the API instance.
// fetchBaseQuery is used to configure the request function that will be used in all requests.

const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (user) => ({
        url: "/users/signup",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation({
      query: (user) => ({
        url: "/users/login",
        method: "POST",
        body: user,
      }),
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
    }),
    deleteProduct: builder.mutation({
      query: ({ productId, userId }) => ({
        url: `/products/${productId}`,
        body: {
          userId,
        },
        method: "DELETE",
      }),
    }),
    updateProduct: builder.mutation({
      query: (product) => ({
        url: `/products/${product.id}`,
        body: product,
        method: "PATCH",
      }),
    }),
    addToCart: builder.mutation({
      query: (cartInfo) => ({
        url: "/products/add-to-cart",
        body: cartInfo,
        method: "POST",
      }),
    }),
    removeFromCart: builder.mutation({
      query: (body) => ({
        url: "/products/remove-from-cart",
        body,
        method: "POST",
      }),
    }),
    increaseCartProduct: builder.mutation({
      query: (body) => ({
        url: "/products/increase-cart",
        body,
        method: "POST",
      }),
    }),
    decreaseCartProduct: builder.mutation({
      query: (body) => ({
        url: "/products/decrease-cart",
        body,
        method: "POST",
      }),
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
    }),
  }),
});

// Export custom hooks for each endpoint defined above

export const {
  useSignupMutation,
  useLoginMutation,
  useCreateProductMutation,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useIncreaseCartProductMutation,
  useDecreaseCartProductMutation,
  useCreateOrderMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = appApi;

export default appApi;
