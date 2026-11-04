import { useState, useEffect } from "react";
import styles from "./HeroCarousel.module.css";

export default function HeroCarousel({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <section className={styles.hero} id="inicio">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${
            index === currentSlide ? styles.active : ""
          }`}
          aria-hidden={index !== currentSlide}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className={styles.image}
          />

          <div className={styles.overlay}></div>

          <div className={styles.content}>
            <span className={styles.subtitle}>
              ATELIÊ ADRIANNA BALAN
            </span>

            <h2>{slide.title}</h2>

            <p>{slide.description}</p>

            <a href="#produtos" className={styles.button}>
              EXPLORE A COLEÇÃO ↗
            </a>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className={styles.controls}>
          <button
            onClick={previousSlide}
            aria-label="Banner anterior"
          >
            ←
          </button>

          <span>
            {String(currentSlide + 1).padStart(2, "0")}
            {" / "}
            {String(slides.length).padStart(2, "0")}
          </span>

          <button
            onClick={nextSlide}
            aria-label="Próximo banner"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}