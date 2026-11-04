import HeroCarousel from "../../components/HeroCarousel/HeroCarousel";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import AboutSection from "../../components/AboutSection/AboutSection";

import { banners } from "../../data/banners";
import { products } from "../../data/products";

export default function Home() {
  return (
    <>
      <HeroCarousel slides={banners} />

      <ProductGrid products={products} />

      <AboutSection />
    </>
  );
}