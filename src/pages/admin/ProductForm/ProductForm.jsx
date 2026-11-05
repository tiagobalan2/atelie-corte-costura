import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  getCategories,
  createProduct,
  uploadProductImage,
  saveProductImage,
  getAdminProductById,
  updateProduct,
  deleteProductImage,
} from "../../../services/adminProductService";
import { supabase } from "../../../lib/supabase";
import {
  getProductImageUrl,
} from "../../../services/productService";
import styles from "./ProductForm.module.css";

function generateSlug(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

const isEditing = Boolean(id);
const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(false);
const [existingImages, setExistingImages] = useState([]);
const [deletingImageId, setDeletingImageId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [available, setAvailable] = useState(true);
  const [publish, setPublish] = useState(false);

  const [images, setImages] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


async function handleDeleteImage(image) {
  if (saving || deletingImageId !== null) return;

  const confirmed = window.confirm(
    "Deseja realmente excluir esta fotografia? Essa ação não pode ser desfeita."
  );

  if (!confirmed) return;

  setDeletingImageId(image.id);
  setError("");

  try {
    await deleteProductImage(image);

    setExistingImages((currentImages) =>
      currentImages.filter(
        (item) => item.id !== image.id
      )
    );
  } catch (err) {
    console.error("Erro ao excluir fotografia:", err);

    setError(
      "Não foi possível concluir a exclusão. Atualize o produto e confira o Storage antes de tentar novamente."
    );
  } finally {
    setDeletingImageId(null);
  }
}

useEffect(() => {
  const previews = images.map((file) => ({
    name: file.name,
    url: URL.createObjectURL(file),
  }));

  setImagePreviews(previews);

  return () => {
    previews.forEach((preview) => {
      URL.revokeObjectURL(preview.url);
    });
  };
}, [images]);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await getCategories();

        if (active) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);

        if (active) {
          setError("Não foi possível carregar as categorias.");
        }
      } finally {
        if (active) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
  if (!isEditing) return;

  let active = true;

  async function loadProduct() {
    setLoadingProduct(true);
    setError("");

    try {
      const product = await getAdminProductById(id);

      if (!active) return;

      setName(product.name || "");
      setDescription(product.description || "");

      setPrice(
        product.price != null
          ? String(product.price).replace(".", ",")
          : ""
      );

      setCategoryId(product.category_id || "");
      setAvailable(product.available ?? true);

      const sortedImages = [
        ...(product.product_images || []),
      ].sort(
        (a, b) => a.display_order - b.display_order
      );

      setExistingImages(sortedImages);

    } catch (err) {
      console.error("Erro ao buscar produto:", err);

      if (active) {
        setError(
          "Não foi possível carregar os dados do produto."
        );
      }
    } finally {
      if (active) {
        setLoadingProduct(false);
      }
    }
  }

  loadProduct();

  return () => {
    active = false;
  };
}, [id, isEditing]);

  function handleImagesChange(event) {
    const selectedFiles = Array.from(event.target.files || []);

    setImages(selectedFiles);
    setError("");
  }

 async function handleSubmit(event) {
  event.preventDefault();

  if (saving || loadingProduct) return;

  setError("");

  const numericPrice = Number(price.replace(",", "."));

  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    setError("Informe um preço válido.");
    return;
  }

  if (!name.trim() || !generateSlug(name)) {
    setError("Informe um nome válido.");
    return;
  }

  if (images.length > 8) {
    setError("Selecione no máximo 8 fotografias.");
    return;
  }

  const acceptedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  const invalidImage = images.some(
    (file) =>
      !acceptedTypes.includes(file.type) ||
      file.size > 5 * 1024 * 1024
  );

  if (invalidImage) {
    setError(
      "Use fotografias JPG, PNG ou WebP de até 5 MB."
    );
    return;
  }

  setSaving(true);

  let savedProduct = null;
  let uploadedCount = 0;

  try {
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      categoryId,
      available,
    };

    if (isEditing) {
      // EDITAR PRODUTO EXISTENTE
      savedProduct = await updateProduct(id, productData);
    } else {
      // CADASTRAR PRODUTO NOVO
      savedProduct = await createProduct({
        ...productData,
        slug: generateSlug(name),
        isPublished: false,
      });
    }

    // Enviar novas fotografias
    const nextOrder =
      existingImages.length > 0
        ? Math.max(
            ...existingImages.map(
              (image) => image.display_order ?? 0
            )
          ) + 1
        : 0;

    for (let index = 0; index < images.length; index++) {
      const file = images[index];

      const storagePath = await uploadProductImage(
        savedProduct.id,
        file
      );

      await saveProductImage(
        savedProduct.id,
        storagePath,
        nextOrder + index
      );

      uploadedCount++;
    }

    navigate("/admin", { replace: true });

  } catch (err) {
    console.error("Erro ao salvar produto:", err);

    if (savedProduct) {
      setError(
        `As informações do produto foram salvas, mas ocorreu uma falha durante as fotografias. ${uploadedCount} fotografia(s) foram associadas. Confira o produto no painel antes de tentar novamente.`
      );
    } else {
      setError(
        "Não foi possível salvar o produto. Confira os dados e tente novamente."
      );
    }
  } finally {
    setSaving(false);
  }
}

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {loadingProduct && (
  <p>Carregando informações do produto...</p>
)}
        <Link to="/admin" className={styles.back}>
          ← Voltar ao painel
        </Link>

        <div className={styles.heading}>
          <span>ATELIÊ ADRIANNA BALAN</span>
<h1>
  {isEditing ? "Editar produto" : "Adicionar produto"}
</h1>          <p>
  {isEditing
    ? "Atualize as informações da peça artesanal."
    : "Preencha as informações da nova peça artesanal."}
</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}   style={{
    display: loadingProduct ? "none" : undefined,
  }}>
          <div className={styles.field}>
            <label htmlFor="productName">
              Nome do produto
            </label>

            <input
              id="productName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Nécessaire Floral"
              maxLength={150}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">
              Descrição
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Descreva o produto, material, tamanho..."
              rows={5}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="price">
                Preço (R$)
              </label>

              <input
                id="price"
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder="59,90"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="category">
                Categoria
              </label>

              <select
                id="category"
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(event.target.value)
                }
                disabled={loadingCategories}
              >
                <option value="">Sem categoria</option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isEditing && existingImages.length > 0 && (
  <div className={styles.field}>
    <label>Fotografias cadastradas</label>

    <div className={styles.imageGrid}>
      {existingImages.map((image) => (
  <div
    key={image.id}
    className={styles.imageCard}
  >
    <img
      src={getProductImageUrl(image.storage_path)}
      alt={image.alt_text || name}
    />

    <button
      type="button"
      className={styles.removeImageButton}
      onClick={() => handleDeleteImage(image)}
      disabled={saving || deletingImageId !== null}
    >
      {deletingImageId === image.id
        ? "Removendo..."
        : "Remover"}
    </button>
  </div>
))}
    </div>

    <small>
      Essas fotografias já estão salvas no produto.
    </small>
  </div>
)}

          <div className={styles.field}>
            <label htmlFor="images">
              Fotografias
            </label>

            <input
              id="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImagesChange}
            />

            {imagePreviews.length > 0 && (
  <div className={styles.previewSection}>
    <span>Novas fotografias</span>

    <div className={styles.imageGrid}>
      {imagePreviews.map((preview) => (
        <div
          className={styles.imageCard}
          key={preview.url}
        >
          <img
            src={preview.url}
            alt={preview.name}
          />
        </div>
      ))}
    </div>
  </div>
)}

            <small>
              Até 8 imagens. JPG, PNG ou WebP, com até 5 MB cada.
            </small>

            {images.length > 0 && (
              <p className={styles.fileCount}>
                {images.length} fotografia(s) selecionada(s).
              </p>
            )}
          </div>

          <div className={styles.checkboxes}>
            <label>
              <input
                type="checkbox"
                checked={available}
                onChange={(event) =>
                  setAvailable(event.target.checked)
                }
              />
              Produto disponível
            </label>

            <label>
              <input
                type="checkbox"
                checked={publish}
                onChange={(event) =>
                  setPublish(event.target.checked)
                }
                disabled
              />
              Publicar imediatamente (em breve)
            </label>
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
<button
  type="submit"
  className={styles.submit}
  disabled={saving || loadingProduct}
>
  {saving
    ? "SALVANDO..."
    : isEditing
      ? "SALVAR ALTERAÇÕES"
      : "SALVAR COMO RASCUNHO"}
</button>
        
        </form>
      </div>
    </main>
  );
}