import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import store from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";

// Setting up the persisted store

const persistedStore = persistStore(store);

// Rendering the root component

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <PersistGate loading={<div>Loading...</div>} persistor={persistedStore}>
        <App />
      </PersistGate>
    </Router>
  </Provider>
);
