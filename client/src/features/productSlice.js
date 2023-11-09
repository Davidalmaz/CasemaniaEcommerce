import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

// This file exports a slice of the Redux store for managing products.

const initialState = [];

// Define the product slice using createSlice from Redux

const productSlice = createSlice({
  name: "products",
  initialState,
  // Define the reducers for updating the state
  reducers: {
    updateProducts: (_, action) => {
      // Return the payload as the new state
      return action.payload;
    },
  },

  // Define extra reducers for handling API requests

  extraReducers: (builder) => {
    // Use addMatcher to match API request action types with corresponding reducers
    builder.addMatcher(
      appApi.endpoints.createProduct.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.updateProduct.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.deleteProduct.matchFulfilled,
      (_, { payload }) => payload
    );
  },
});

// Export the updateProducts action creator for updating the state

export const { updateProducts } = productSlice.actions;

export default productSlice.reducer;
