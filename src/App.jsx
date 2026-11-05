import { Routes, Route, Outlet } from "react-router";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ProductForm from "./pages/admin/ProductForm/ProductForm";

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
        {/* ROTAS PÚBLICAS */}

        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/produtos/:slug"
            element={<ProductDetails />}
          />
        </Route>

        {/* LOGIN ADMINISTRATIVO */}

        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/* ROTAS ADMINISTRATIVAS PROTEGIDAS */}

        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin"
            element={<Dashboard />}
          />

          <Route
            path="/admin/produtos/novo"
            element={<ProductForm />}
          />
        </Route>
        <Route
  path="/admin/produtos/editar/:id"
  element={<ProductForm />}
/>
      </Routes>
    </>
  );
}