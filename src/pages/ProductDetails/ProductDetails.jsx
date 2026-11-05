import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

import {
  getProductBySlug,
  getProductImageUrl,
} from "../../services/productService";
import Loader from "../../components/Loader/Loader";

import styles from "./ProductDetails.module.css";

export default function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setError(null);
      setProduct(null);
      setSelectedImage(0);

      try {
        const data = await getProductBySlug(slug);

        if (!ignore) {
          setProduct(data);
        }
      } catch (err) {
        console.error("Erro ao carregar produto:", err);

        if (!ignore) {
          setError("Não foi possível carregar este produto.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className={styles.notFound}>
        <h2>{error}</h2>
        <Link to="/">Voltar ao catálogo</Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className={styles.notFound}>
        <h2>Produto não encontrado.</h2>
        <Link to="/">Voltar ao catálogo</Link>
      </section>
    );
  }

  // Temporário: imagens do catálogo demonstrativo.
  // Vamos substituir pelo Supabase Storage.
  const images = [...(product.product_images || [])]
  .sort((a, b) => a.display_order - b.display_order)
  .map((image) => getProductImageUrl(image.storage_path))
  .filter(Boolean);

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
          {images.length > 0 ? (
            <>
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
                    type="button"
                    className={
                      selectedImage === index
                        ? styles.selected
                        : ""
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
            </>
          ) : (
            <div className={styles.mainImage}>
              <p>Fotografia em breve</p>
            </div>
          )}
        </div>

        <div className={styles.information}>
          <span className={styles.category}>
            ATELIÊ ADRIANNA BALAN /{" "}
            {product.categories?.name || "Artesanato"}
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
            <li>
              {product.available
                ? "Consulte disponibilidade e entrega"
                : "Produto indisponível no momento"}
            </li>
          </ul>

          <hr />

          <p>
            Pagamento e entrega são combinados diretamente
            com o ateliê.
          </p>

          <button
            className={styles.whatsapp}
            disabled
          >
            CONSULTAR PELO WHATSAPP ↗
          </button>

          <button
            className={styles.instagram}
            disabled
          >
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