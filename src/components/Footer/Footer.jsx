import { Link } from "react-router";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} id="contato">
      <div className={styles.container}>
        <div className={styles.brand}>
          <h2>ADRIANNA BALAN</h2>

          <span>ATELIÊ DE CORTE & COSTURA</span>

          <p>
            Criações artesanais que unem afeto,
            personalidade e atenção aos detalhes.
          </p>
        </div>

        <div className={styles.column}>
          <h3>NAVEGUE</h3>

          <Link to="/">Início</Link>
          <Link to="/#produtos">Produtos</Link>
          <Link to="/#sobre">O Ateliê</Link>
        </div>

        <div className={styles.column}>
          <h3>ATENDIMENTO</h3>

          <span>WhatsApp</span>
          <span>Instagram</span>
        </div>

        <div className={styles.column}>
          <h3>UMA PEÇA ESPECIAL?</h3>

          <p>
            Gostou de alguma criação? Entre em contato
            e descubra nossas opções disponíveis.
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>
          © {new Date().getFullYear()} ATELIÊ ADRIANNA BALAN
        </span>

        <span>
          FEITO À MÃO, COM HISTÓRIA.
        </span>
      </div>
    </footer>
  );
}