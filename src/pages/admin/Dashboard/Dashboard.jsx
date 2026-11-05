import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { supabase } from "../../../lib/supabase";
import {
  setProductPublished,
} from "../../../services/adminProductService";
import {
  getAdminProducts,
  getProductImageUrl,
} from "../../../services/productService";

import Loader from "../../../components/Loader/Loader";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);
const [actionError, setActionError] = useState("");
  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const data = await getAdminProducts();

        if (active) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);

        if (active) {
          setError("Não foi possível carregar os produtos.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    

    return () => {
      active = false;
    };
  }, []);

  async function handleTogglePublished(product) {
  if (updatingId) return;

  setActionError("");

  // Evitar publicar produtos sem fotografia
  if (
    !product.is_published &&
    !product.product_images?.length
  ) {
    setActionError(
      "Adicione pelo menos uma fotografia antes de publicar."
    );
    return;
  }

  setUpdatingId(product.id);

  try {
    const updatedProduct = await setProductPublished(
      product.id,
      !product.is_published
    );

    setProducts((currentProducts) =>
      currentProducts.map((item) =>
        item.id === product.id
          ? { ...item, ...updatedProduct }
          : item
      )
    );
  } catch (err) {
    console.error("Erro ao alterar publicação:", err);

    setActionError(
      "Não foi possível alterar a publicação do produto."
    );
  } finally {
    setUpdatingId(null);
  }
}

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao sair:", error);
      return;
    }

    navigate("/admin/login", { replace: true });
  }

  const totalProducts = products.length;

  const publishedProducts = products.filter(
    (product) => product.is_published
  ).length;

  const unavailableProducts = products.filter(
    (product) => !product.available
  ).length;

  function formatPrice(price) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }

  function getMainImage(product) {
    const images = [...(product.product_images || [])];

    images.sort(
      (a, b) => a.display_order - b.display_order
    );

    return images.length > 0
      ? getProductImageUrl(images[0].storage_path)
      : null;
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <span className={styles.label}>
            ATELIÊ ADRIANNA BALAN
          </span>

          <h1>Painel Administrativo</h1>
        </div>

        <button
          className={styles.logout}
          onClick={handleLogout}
        >
          Sair
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.welcome}>
          <div>
            <h2>Visão geral</h2>
            <p>Gerencie o catálogo do seu ateliê.</p>
          </div>

          <Link
  to="/"
  className={styles.visitSite}
  target="_blank"
  rel="noopener noreferrer"
>
  Visualizar site ↗
</Link>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          <>
            <section className={styles.stats}>
              <div className={styles.statCard}>
                <span>Total de produtos</span>
                <strong>{totalProducts}</strong>
              </div>

              <div className={styles.statCard}>
                <span>Produtos publicados</span>
                <strong>{publishedProducts}</strong>
              </div>

              <div className={styles.statCard}>
                <span>Indisponíveis</span>
                <strong>{unavailableProducts}</strong>
              </div>
            </section>

            <section className={styles.productsSection}>
            {actionError && (
  <p className={styles.actionError} role="alert">
    {actionError}
  </p>
)}
              <div className={styles.sectionHeader}>
  <div>
    <h2>Produtos</h2>
    <p>Confira os produtos cadastrados.</p>
  </div>

  <Link
    to="/admin/produtos/novo"
    className={styles.addButton}
  >
    + Adicionar produto
  </Link>
</div>

              {products.length === 0 ? (
                <div className={styles.empty}>
                  Nenhum produto cadastrado.
                </div>
              ) : (
                <div className={styles.productList}>
                  {products.map((product) => {
                    const image = getMainImage(product);

                    return (
                      <article
                        key={product.id}
                        className={styles.product}
                      >
                        <div className={styles.productInfo}>
                          {image ? (
                            <img
                              src={image}
                              alt={product.name}
                              className={styles.productImage}
                            />
                          ) : (
                            <div
                              className={styles.productImagePlaceholder}
                            >
                              Sem foto
                            </div>
                          )}

                          <div>
                            <h3>{product.name}</h3>

                            <span className={styles.category}>
                              {product.categories?.name ||
                                "Sem categoria"}
                            </span>
                          </div>
                        </div>

                        <strong className={styles.price}>
                          {formatPrice(product.price)}
                        </strong>

                        <div className={styles.statusGroup}>
                          <span
                            className={
                              product.is_published
                                ? styles.published
                                : styles.draft
                            }
                          >
                            {product.is_published
                              ? "Publicado"
                              : "Rascunho"}
                          </span>

                          {!product.available && (
                            <span className={styles.unavailable}>
                              Indisponível
                            </span>
                          )}
                        </div>

                        <div className={styles.actions}>
  {product.is_published && (
    <Link
      to={`/produtos/${product.slug}`}
      className={styles.viewProduct}
      target="_blank"
        rel="noopener noreferrer"
    >
      Ver ↗
    </Link>
  )}

<Link
  to={`/admin/produtos/editar/${product.id}`}
  className={styles.editButton}
>
  Editar
</Link>
  <button
    type="button"
    className={
      product.is_published
        ? styles.unpublishButton
        : styles.publishButton
    }
    onClick={() => handleTogglePublished(product)}
    disabled={updatingId !== null}
  >
    {updatingId === product.id
      ? "Salvando..."
      : product.is_published
        ? "Retirar do site"
        : "Publicar"}
  </button>
</div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}