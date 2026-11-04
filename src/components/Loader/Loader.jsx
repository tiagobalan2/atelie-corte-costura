import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.container} role="status" aria-label="Carregando produtos">
      <div className={styles.spinner} />
    </div>
  );
}