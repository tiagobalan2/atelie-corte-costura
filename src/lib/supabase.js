import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log("Supabase URL encontrada:", Boolean(supabaseUrl));
console.log("Chave pública encontrada:", Boolean(supabaseKey));

export const supabase = createClient(supabaseUrl, supabaseKey);
