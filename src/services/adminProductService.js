import { supabase } from "../lib/supabase";

// Buscar categorias
export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (error) {
    throw error;
  }

  return data;
}

// Criar produto
export async function createProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category_id: product.categoryId || null,
      available: product.available,
      is_published: product.isPublished,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Enviar fotografia
export async function uploadProductImage(productId, file) {
  const extension = file.name.split(".").pop().toLowerCase();

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const storagePath = `${productId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  return storagePath;
}

// Associar fotografia ao produto
export async function saveProductImage(
  productId,
  storagePath,
  displayOrder = 0,
) {
  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      storage_path: storagePath,
      display_order: displayOrder,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function setProductPublished(productId, isPublished) {
  const { data, error } = await supabase
    .from("products")
    .update({
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Buscar produto para edição
export async function getAdminProductById(productId) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (
        id,
        storage_path,
        alt_text,
        display_order
      )
    `,
    )
    .eq("id", productId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Atualizar informações do produto
export async function updateProduct(productId, product) {
  const { data, error } = await supabase
    .from("products")
    .update({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.categoryId || null,
      available: product.available,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function deleteProductImage(image) {
  // Primeiro remover a associação no banco
  const { error: databaseError } = await supabase
    .from("product_images")
    .delete()
    .eq("id", image.id);

  if (databaseError) {
    throw databaseError;
  }

  // Depois remover o arquivo do Storage
  const { error: storageError } = await supabase.storage
    .from("product-images")
    .remove([image.storage_path]);

  if (storageError) {
    throw new Error(
      "Registro removido, mas o arquivo não pôde ser excluído do Storage.",
    );
  }
}
