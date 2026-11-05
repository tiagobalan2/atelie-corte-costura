import { Routes, Route, Outlet } from "react-router";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import Home from "./pages/Home/Home";
import ProductDetails from "./pages/ProductDetails/ProductDetails";

import Login from "./pages/admin/Login/Login";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Layout das páginas públicas
function PublicLayout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/produtos/:slug"
            element={<ProductDetails />}
          />
        </Route>

        <Route
          path="/admin/login"
          element={<Login />}
        />

        <Route
          element={<ProtectedRoute />}
        >
          <Route
            path="/admin"
            element={<Dashboard />}
          />
        </Route>
      </Routes>
    </>
  );
}