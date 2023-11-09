import productSlice from "./features/productSlice";
import userSlice from "./features/userSlice";
import appApi from "./services/appApi";
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";

// Combining all the reducers

const reducer = combineReducers({
  user: userSlice,
  products: productSlice,
  [appApi.reducerPath]: appApi.reducer,
});

// Configuring the store to persist data across sessions

const persistConfig = {
  key: "root",
  storage,
  blacklist: [appApi.reducerPath, "products"],
};

const persistedReducer = persistReducer(persistConfig, reducer);

// Creating the store with the required middleware

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, appApi.middleware],
});

export default store;
