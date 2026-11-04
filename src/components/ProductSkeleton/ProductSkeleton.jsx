import styles from "./ProductSkeleton.module.css";

export default function ProductSkeleton() {
  return (
    <section
      className={styles.section}
      aria-label="Carregando produtos"
      aria-busy="true"
    >
      <div className={styles.heading}>
        <span>NOSSA VITRINE</span>
        <h2>Peças em destaque</h2>
      </div>

      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.image} />

            <div className={styles.info}>
              <div className={styles.name} />
              <div className={styles.description} />
              <div className={styles.price} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}