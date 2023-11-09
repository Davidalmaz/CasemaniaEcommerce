import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import Navigation from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewProduct from "./pages/NewProduct";
import Signup from "./pages/Signup";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import ScrollToTop from "./components/ScrollToTop";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/AdminDashboard";
import EditProductPage from "./pages/EditProductPage";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { addNotification } from "./features/userSlice";

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const loggedIn = !!user;

  useEffect(() => {
    const socket = io("ws://localhost:8080");
    // Listen to the event emitter called notification
    socket.off("notification").on("notification", (message, userId) => {
      // Execute the code if receives notification event from server
      if (userId === user._id) {
        dispatch(addNotification(message));
      }
    });

    // Listen to the event emitter called new-order
    socket.off("new-order").on("new-order", (message) => {
      if (user.isAdmin) {
        dispatch(addNotification(message));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={loggedIn ? <Navigate to="/"/> : <Login />} />
        <Route path="/signup" element={loggedIn ? <Navigate to="/"/> : <Signup />} />
         {/* route for visitor */}
         {(
          <>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </>
         )

         }
        {/* route for client */}
        {user && (
          <>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </>
        )}
        {/* route for admin user */}
        {user && user.isAdmin && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/product/:id/edit" element={<EditProductPage />} />
          </>
        )}
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/new-product" element={<NewProduct />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
