import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { supabase } from "../../../lib/supabase";

import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // 1. Autenticar no Supabase
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError) {
        throw authError;
      }

      // 2. Verificar se o usuário é administrador
      const { data: admin, error: adminError } =
        await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", data.user.id)
          .maybeSingle();

      if (adminError) {
        throw adminError;
      }

      if (!admin) {
        await supabase.auth.signOut();
        setError("Esta conta não possui acesso administrativo.");
        return;
      }

      // 3. Redirecionar para o painel
      navigate("/admin", { replace: true });

    } catch (err) {
      console.error("Falha na autenticação:", err);

      setError(
        "Não foi possível entrar. Confira suas credenciais e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.brand}>
          <span className={styles.subtitle}>
            ÁREA ADMINISTRATIVA
          </span>

          <h1>Ateliê Adrianna Balan</h1>

          <p>
            Entre para gerenciar os produtos do ateliê.
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="seu@email.com"
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Senha</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        <Link to="/" className={styles.backLink}>
          ← Voltar ao site
        </Link>
      </div>
    </main>
  );
}