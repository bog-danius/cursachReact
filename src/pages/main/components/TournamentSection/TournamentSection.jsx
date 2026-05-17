import styles from './TournamentSection.module.css';
import { SectionTitle } from '@shared/SectionTitle';
import { Button } from '@shared/Button';

export const TournamentSection = () => {
    return (
        <section className={styles.tournament}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <SectionTitle
                        subtitle="Турниры"
                        title="Контролируйте каждый этап соревнований"
                        description="От регистрации участников до финальной таблицы результатов — всё в одном интерфейсе."
                    />

                    <Button text="Начать сейчас" />
                </div>

                <div className={styles.right}>
                    <div className={styles.panel}>
                        <div className={styles.row}>
                            <span>Valorant Championship</span>
                            <strong>Live</strong>
                        </div>

                        <div className={styles.match}>
                            <div>
                                <h4>Team Alpha</h4>
                                <span>12 побед</span>
                            </div>

                            <div className={styles.score}>2 : 1</div>

                            <div>
                                <h4>Cyber Wolves</h4>
                                <span>10 побед</span>
                            </div>
                        </div>

                        <div className={styles.footer}>
                            Обновление результатов в реальном времени
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};