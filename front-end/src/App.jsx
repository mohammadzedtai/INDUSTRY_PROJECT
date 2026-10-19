
import { useState, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ProfileDashboard from "./pages/ProfilePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderCompletePage from "./pages/OrderCompletePage";
import WishlistPage from "./pages/WishlistPage";

// Login-required routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/auth" replace />;
};

function App() {
  const location = useLocation();
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  useEffect(() => {
    const updateToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", updateToken);

    return () => {
      window.removeEventListener("storage", updateToken);
    };
  }, []);

  const hideLayout = location.pathname === "/auth" || location.pathname === "/dashboard" || location.pathname === "/dashboard/products" || location.pathname === "/dashboard/categories" || location.pathname === "/dashboard/orders" || location.pathname === "/dashboard/customers" || location.pathname === "/dashboard/settings";

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/check-out" element={<CheckoutPage />} />

        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-complete"
          element={
            <ProtectedRoute>
              <OrderCompletePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* Admin Portal Nested Routes */}
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
