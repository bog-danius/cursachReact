import styles from './FeaturesSection.module.css';
import { SectionTitle } from '@shared/SectionTitle';

export const FeaturesSection = () => {
    return (
        <section className={styles.features}>
            <div className={styles.container}>
                <SectionTitle
                    subtitle="Функциональность"
                    title="Все инструменты для организации турниров"
                    description="Платформа автоматизирует проведение соревнований и упрощает управление участниками."
                />

                <div className={styles.grid}>
                    <div className={styles.card}>
                        <div className={styles.icon}>01</div>

                        <h3>Гибкая настройка турниров</h3>

                        <p>
                            Создавайте турниры любого формата:
                            Single Elimination, Double Elimination или Round Robin.
                        </p>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.icon}>02</div>

                        <h3>Автоматические сетки</h3>

                        <p>
                            Система самостоятельно формирует турнирные сетки
                            и обновляет результаты матчей.
                        </p>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.icon}>03</div>

                        <h3>Аналитика и статистика</h3>

                        <p>
                            Отслеживайте показатели игроков, историю матчей
                            и эффективность команд.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};