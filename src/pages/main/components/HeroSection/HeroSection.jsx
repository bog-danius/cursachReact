import styles from './HeroSection.module.css';
import { Button } from '@shared/Button';

export const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <span className={styles.subtitle}>
            Онлайн-платформа для организации турниров
          </span>

          <h1 className={styles.title}>
            Лучшие киберспортивные команды мира
          </h1>

          <p className={styles.description}>
            Покупайте билеты на турнир, удобно и без очередей.
          </p>

          <Button text="Выбрать турнир" to="/tickets" />
        </div>
      </div>
    </section>
  );
};