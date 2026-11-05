import { useEffect, useState } from "react";

import HeroCarousel from "../../components/HeroCarousel/HeroCarousel";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import AboutSection from "../../components/AboutSection/AboutSection";
import Loader from "../../components/Loader/Loader";import { banners } from "../../data/banners";

import {
  getProducts,
  getProductImageUrl,
} from "../../services/productService";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        // Temporário: aproveitamos as imagens demonstrativas
        // enquanto não configuramos o Supabase Storage.
        const formattedProducts = data.map((product) => {
  const sortedImages = [...(product.product_images || [])]
    .sort((a, b) => a.display_order - b.display_order);

  const mainImage = sortedImages[0];

  return {
    ...product,
    image: mainImage
      ? getProductImageUrl(mainImage.storage_path)
      : "",
  };
});

        setProducts(formattedProducts);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os produtos.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <>
      <HeroCarousel slides={banners} />

{loading ? (
  <Loader />
) : error ? (
  <p>{error}</p>
) : (
  <ProductGrid products={products} />
)}

      <AboutSection />
    </>
  );
}