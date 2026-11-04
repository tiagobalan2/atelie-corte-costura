import { Link } from "react-router";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <Link
      to={`/produtos/${product.slug}`}
      className={styles.card}
    >
      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
        />

        <span className={styles.badge}>
          FEITO À MÃO
        </span>
      </div>

      <div className={styles.information}>
        <h3>{product.name}</h3>

        <p>{product.description}</p>

        <strong>{formattedPrice}</strong>
      </div>
    </Link>
  );
}