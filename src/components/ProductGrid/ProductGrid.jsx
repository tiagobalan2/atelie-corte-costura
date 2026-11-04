import ProductCard from "../ProductCard/ProductCard";

import styles from "./ProductGrid.module.css";

export default function ProductGrid({ products }) {
  return (
    <section className={styles.section} id="produtos">
      <div className={styles.heading}>
        <span>NOSSA VITRINE</span>

        <h2>Peças em destaque</h2>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}