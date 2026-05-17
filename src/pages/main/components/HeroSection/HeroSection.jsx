import styles from './HeroSection.module.css';
import { Button } from '@shared/Button';

export const HeroSection = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.blurOne}></div>
            <div className={styles.blurTwo}></div>

            <div className={styles.container}>
                <div className={styles.content}>
          <span className={styles.subtitle}>
            Tournament Management Platform
          </span>

                    <h1 className={styles.title}>
                        Современная платформа для проведения онлайн-турниров
                    </h1>

                    <p className={styles.description}>
                        Управляйте матчами, командами и статистикой игроков
                        в единой цифровой экосистеме для киберспорта.
                    </p>

                    <div className={styles.actions}>
                        <Button text="Создать турнир" />
                        <button className={styles.secondaryButton}>
                            Смотреть демо
                        </button>
                    </div>

                    <div className={styles.stats}>
                        <div>
                            <h3>10K+</h3>
                            <span>Игроков</span>
                        </div>

                        <div>
                            <h3>500+</h3>
                            <span>Турниров</span>
                        </div>

                        <div>
                            <h3>99%</h3>
                            <span>Стабильность</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};