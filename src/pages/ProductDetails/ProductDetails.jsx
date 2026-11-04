import { useState } from "react";
import { useParams, Link } from "react-router";

import { products } from "../../data/products";
import styles from "./ProductDetails.module.css";

export default function ProductDetails() {
  const { slug } = useParams();

  const product = products.find((item) => item.slug === slug);

  const images = product?.images?.length
    ? product.images
    : product
      ? [product.image]
      : [];

  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <section className={styles.notFound}>
        <h2>Produto não encontrado.</h2>
        <Link to="/">Voltar ao catálogo</Link>
      </section>
    );
  }

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <section className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link to="/">Início</Link>
        <span> / Produtos / {product.name}</span>
      </div>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img
              src={images[selectedImage] || images[0]}
              alt={product.name}
            />
          </div>

          <div className={styles.thumbnails}>
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={
                  selectedImage === index ? styles.selected : ""
                }
                onClick={() => setSelectedImage(index)}
                aria-label={`Visualizar foto ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${product.name} - foto ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.information}>
          <span className={styles.category}>
            ATELIÊ ADRIANNA BALAN / {product.category}
          </span>

          <h1>{product.name}</h1>

          <strong className={styles.price}>
            {formattedPrice}
          </strong>

          <p>{product.description}</p>

          <hr />

          <h3>Informações do produto</h3>

          <ul>
            <li>Produção artesanal</li>
            <li>Feito com atenção aos detalhes</li>
            <li>Consulte disponibilidade e entrega</li>
          </ul>

          <hr />

          <p>
            Pagamento e entrega são combinados diretamente
            com o ateliê.
          </p>

          <button className={styles.whatsapp} disabled>
            CONSULTAR PELO WHATSAPP ↗
          </button>

          <button className={styles.instagram} disabled>
            FALAR PELO INSTAGRAM ↗
          </button>

          <small>
            Os canais de contato serão configurados posteriormente.
          </small>
        </div>
      </div>
    </section>
  );
}