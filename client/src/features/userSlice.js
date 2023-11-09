import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

// This file exports a slice of the Redux store for managing the user.

const initialState = null;

// Define the user slice using createSlice from Redux

const userSlice = createSlice({
  name: "user",
  initialState,
  // Define the reducers for updating the state
  reducers: {
    // Set the state to null to log out the user
    logout: () => initialState,
    // Add a notification to the list of notifications
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    // Set all notifications to "read"
    resetNotifications: (state, action) => {
      state.notifications.forEach((notification) => {
        notification.status = "read";
      });
    },
  },

  // Define extra reducers for handling API requests

  extraReducers: (builder) => {
    // Use addMatcher to match API request action types with corresponding reducers
    builder.addMatcher(
      appApi.endpoints.signup.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.login.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.addToCart.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.removeFromCart.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.increaseCartProduct.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.decreaseCartProduct.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.createOrder.matchFulfilled,
      (_, { payload }) => payload
    );
  },
});

// Export the logout, addNotification and resetNotifications action creator for updating the state
export const { logout, addNotification, resetNotifications } =
  userSlice.actions;

export default userSlice.reducer;
