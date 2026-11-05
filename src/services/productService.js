import { supabase } from "../lib/supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (
        id,
        storage_path,
        display_order
      )
    `,
    )
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        name
      ),
      product_images (
        id,
        storage_path,
        alt_text,
        display_order
      )
    `,
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export function getProductImageUrl(storagePath) {
  if (!storagePath) {
    return null;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

export async function getAdminProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        name
      ),
      product_images (
        id,
        storage_path,
        display_order
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
