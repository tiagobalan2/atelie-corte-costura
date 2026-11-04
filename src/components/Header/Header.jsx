import styles from "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <h1>ADRIANNA BALAN</h1>
                <span>ATELIê DE CORTE & COSTURA</span>
            </div>

            <nav className={styles.navigation}>
  <a href="/">Início</a>
  <a href="/#produtos">Produtos</a>
  <a href="/#sobre">O Ateliê</a>
  <a href="/#contato">Contato</a>
</nav>

            <a href="#contato" className={styles.contactButton}>FALE CONOSCO</a>

        </header>
    )
}