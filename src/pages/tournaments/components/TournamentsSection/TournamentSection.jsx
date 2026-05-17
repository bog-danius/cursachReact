import { useEffect, useState } from "react";
import styles from "./TournamentSection.module.css";
import { SectionTitle } from "@shared/SectionTitle";
import { getAllTournaments } from "@pages/main/api/api";

export const TournamentSection = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllTournaments()
            .then(setTournaments)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    // Показываем только первые 3 на главной
    const visible = tournaments.slice(0, 3);

    return (
        <section className={styles.tournaments} id="tournaments">
            <SectionTitle
                subtitle="Live"
                title="Активные турниры"
                description="Следите за матчами в реальном времени"
            />

            {loading && <p className={styles.state}>Загрузка...</p>}
            {error && <p className={styles.state}>{error}</p>}

            {!loading && !error && tournaments.length === 0 && (
                <p className={styles.state}>Турниров пока нет</p>
            )}

            <div className={styles.grid}>
                {visible.map((tournament) => (
                    <div key={tournament.id} className={styles.card}>

                        {/* Игра (из promotion.title) */}
                        <div className={styles.cardHeader}>
                            <span className={styles.game}>
                                {tournament.promotion?.title ?? "Турнир"}
                            </span>
                            <span className={styles.date}>
                                {new Date(tournament.eventDate).toLocaleDateString("ru-RU")}
                            </span>
                        </div>

                        {/* Название турнира */}
                        <h3 className={styles.cardTitle}>{tournament.title}</h3>

                        {/* Счёт из description */}
                        {tournament.description ? (
                            <div className={styles.scoreBlock}>
                                <span className={styles.scoreLabel}>Счёт</span>
                                <span className={styles.score}>{tournament.description}</span>
                            </div>
                        ) : (
                            <p className={styles.noScore}>Матч ещё не начался</p>
                        )}

                        {/* Команд */}
                        <div className={styles.teams}>
                            👥 Макс. команд: {tournament.quantity}
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
};
