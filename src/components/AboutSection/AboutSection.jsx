import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <section className={styles.about} id="sobre">
      <div className={styles.imageContainer}>
        <img
          src="/sobre-atelie.jpg"
          alt="Trabalho artesanal do Ateliê Adrianna Balan"
        />
      </div>

      <div className={styles.content}>
        <span className={styles.subtitle}>
          NOSSA ESSÊNCIA
        </span>

        <h2>
          Histórias costuradas em cada detalhe.
        </h2>

        <p>
          Com o ponto firme e mais de 10 anos de experiência
          na arte da costura, o Ateliê Adrianna Balan
          transforma tecidos em peças únicas, feitas com
          carinho, dedicação e atenção aos detalhes.
        </p>

        <p>
          Cada criação carrega um toque especial, unindo
          a delicadeza do trabalho artesanal à beleza
          e à personalidade do patchwork.
        </p>

        <a href="#contato" className={styles.button}>
          ENTRE EM CONTATO ↗
        </a>
      </div>
    </section>
  );
}