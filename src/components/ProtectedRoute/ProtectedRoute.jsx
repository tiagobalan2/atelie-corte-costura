import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

import { supabase } from "../../lib/supabase";
import Loader from "../Loader/Loader";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      try {
        // Verifica se existe um usuário autenticado
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          if (active) setStatus("denied");
          return;
        }

        // Verifica se está na lista de administradores
        const { data: admin, error: adminError } =
          await supabase
            .from("admin_users")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();

        if (adminError || !admin) {
          if (active) setStatus("denied");
          return;
        }

        if (active) setStatus("authorized");
      } catch (error) {
        console.error("Erro ao verificar acesso:", error);

        if (active) setStatus("denied");
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "denied") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}