import { Routes, Route } from "react-router";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import Home from "./pages/Home/Home";
import ProductDetails from "./pages/ProductDetails/ProductDetails";

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/produtos/:slug"
            element={<ProductDetails />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}