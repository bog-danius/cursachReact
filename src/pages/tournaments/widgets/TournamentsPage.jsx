import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from '@shared/Header';
import { Footer } from '@shared/Footer';
import styles from "./TournamentsPage.module.css";
import { getCurrentUser } from "../../auth/api/api.js";

import {
    getAllTournaments,
    getGames,
    registerForTournament,
    getMyRegistrations,
} from "../api/api.js";

// ─────────────────────────────────────────────
// Заглушка пользователя
// потом заменишь на auth/jwt
// ─────────────────────────────────────────────

export const TournamentsPage = () => {
    const currentUser = getCurrentUser();
    const [tournaments, setTournaments] = useState([]);
    const [games, setGames] = useState([]);
    const [myRegs, setMyRegs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [tab, setTab] = useState("all");
    // all | my | favorites

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("favorite-tournaments");

        return saved ? JSON.parse(saved) : [];
    });
    const [selectedTournament, setSelectedTournament] = useState(null);
    // ─────────────────────────────────────────────
    // Load
    // ─────────────────────────────────────────────

    const load = async () => {

        try {

            setLoading(true);

            const [
                tournamentsData,
                gamesData,
                registrationsData
            ] = await Promise.all([
                getAllTournaments(),
                getGames(),
                getMyRegistrations(),
            ]);

            setTournaments(tournamentsData);
            setGames(gamesData);
            setMyRegs(registrationsData);

        } catch (error) {

            console.error(
                "Ошибка загрузки",
                error
            );

        } finally {

            setLoading(false);

        }

    };
    useEffect(() => {
        load();
    }, []);

    // ─────────────────────────────────────────────
    // Favorites
    // ─────────────────────────────────────────────

    useEffect(() => {
        localStorage.setItem(
            "favorite-tournaments",
            JSON.stringify(favorites)
        );
    }, [favorites]);

    const toggleFavorite = (id) => {
        setFavorites((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    // ─────────────────────────────────────────────
    // Register
    // ─────────────────────────────────────────────

    const handleRegister = async (tournamentId) => {
        try {
            await registerForTournament(
                tournamentId
            );

            alert("Вы успешно зарегистрировались!");

            load();
        } catch (e) {
            alert(e.message);
        }
    };

    // ─────────────────────────────────────────────
    // Мои турниры
    // ─────────────────────────────────────────────

    const myTournamentIds = useMemo(() => {
        return new Set(myRegs.map((r) => r.ticketId));
    }, [myRegs]);

    // ─────────────────────────────────────────────
    // Filter
    // ─────────────────────────────────────────────

    const displayed = useMemo(() => {

        if (tab === "my") {
            return tournaments.filter((t) =>
                myTournamentIds.has(t.id)
            );
        }

        if (tab === "favorites") {
            return tournaments.filter((t) =>
                favorites.includes(t.id)
            );
        }

        return tournaments;

    }, [tab, tournaments, favorites, myTournamentIds]);

    // ─────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────

    return (
        <>
            <Header />
            <main className={styles.page}>

                {/* ───────────────── HEADER ───────────────── */}

                <div className={styles.pageHeader}>

                    <div>
                    <span className={styles.subtitle}>
                        Esports Platform
                    </span>

                        <h1 className={styles.title}>
                            Турниры
                        </h1>

                        <p className={styles.description}>
                            Следите за киберспортивными матчами,
                            участвуйте в турнирах и сохраняйте
                            любимые события.
                        </p>
                    </div>

                </div>

                {/* ───────────────── TABS ───────────────── */}

                <div className={styles.tabs}>

                    <button
                        className={`${styles.tab} ${
                            tab === "all"
                                ? styles.tabActive
                                : ""
                        }`}
                        onClick={() => setTab("all")}
                    >
                        Все турниры
                    </button>

                    <button
                        className={`${styles.tab} ${
                            tab === "my"
                                ? styles.tabActive
                                : ""
                        }`}
                        onClick={() => setTab("my")}
                    >
                        Мои турниры
                    </button>

                    <button
                        className={`${styles.tab} ${
                            tab === "favorites"
                                ? styles.tabActive
                                : ""
                        }`}
                        onClick={() => setTab("favorites")}
                    >
                        Избранное
                    </button>

                </div>

                {/* ───────────────── STATES ───────────────── */}

                {loading && (
                    <p className={styles.state}>
                        Загрузка турниров...
                    </p>
                )}

                {!loading && displayed.length === 0 && (
                    <p className={styles.state}>
                        {tab === "my" &&
                            "Вы пока не участвуете ни в одном турнире"}

                        {tab === "favorites" &&
                            "У вас нет избранных турниров"}

                        {tab === "all" &&
                            "Турниров пока нет"}
                    </p>
                )}

                {/* ───────────────── GRID ───────────────── */}

                <div className={styles.grid}>

                    {displayed.map((tournament) => {

                        const isRegistered =
                            myTournamentIds.has(tournament.id);

                        const isFavorite =
                            favorites.includes(tournament.id);

                        return (

                            <div
                                key={tournament.id}
                                className={styles.card}
                            >

                                {/* ───────────────── IMAGE ───────────────── */}

                                <div className={styles.posterWrapper}>

                                    <img
                                        src={
                                            tournament.posterUrl ||
                                            "https://images.unsplash.com/photo-1542751371-adc38448a05e"
                                        }
                                        alt={tournament.title}
                                        className={styles.poster}
                                    />

                                    <button
                                        className={`${styles.favoriteBtn} ${
                                            isFavorite
                                                ? styles.favoriteActive
                                                : ""
                                        }`}
                                        onClick={() =>
                                            toggleFavorite(
                                                tournament.id
                                            )
                                        }
                                    >
                                        {isFavorite ? "★" : "☆"}
                                    </button>

                                </div>

                                {/* ───────────────── BODY ───────────────── */}

                                <div className={styles.cardBody}>

                                    <div className={styles.cardTop}>

                                    <span className={styles.game}>
                                        {tournament.promotion?.title ??
                                            "Tournament"}
                                    </span>

                                        <span className={styles.cardDate}>
                                        {new Date(
                                            tournament.eventDate
                                        ).toLocaleDateString(
                                            "ru-RU"
                                        )}
                                    </span>

                                    </div>

                                    {/* ───────────────── TITLE ───────────────── */}

                                    <h3 className={styles.cardTitle}>
                                        {tournament.title}
                                    </h3>

                                    {/* ───────────────── SCORE ───────────────── */}

                                    {tournament.description ? (
                                        <div className={styles.scoreBlock}>

                                        <span className={styles.scoreLabel}>
                                            Счёт
                                        </span>

                                            <span className={styles.scoreValue}>
                                            {tournament.description}
                                        </span>

                                        </div>
                                    ) : (
                                        <div className={styles.noScore}>
                                            Матч ещё не начался
                                        </div>
                                    )}

                                    {/* ───────────────── META ───────────────── */}

                                    <div className={styles.meta}>

                                    <span>
                                        👥 Макс. команд:
                                        {" "}
                                        {tournament.quantity}
                                    </span>

                                        <span>
                                        🎮 Участников:
                                            {" "}
                                            {tournament.orders?.length ?? 0}
                                    </span>

                                    </div>

                                    {/* ───────────────── ACTIONS ───────────────── */}

                                    <div className={styles.cardActions}>

                                        {!isRegistered ? (

                                            <button
                                                className={styles.registerBtn}
                                                onClick={() =>
                                                    handleRegister(
                                                        tournament.id
                                                    )
                                                }
                                            >
                                                Участвовать
                                            </button>

                                        ) : (

                                            <div className={styles.registered}>
                                                ✓ Вы участвуете
                                            </div>

                                        )}

                                        <button
                                            className={styles.detailsBtn}
                                            onClick={() => setSelectedTournament(tournament)}
                                        >
                                            Подробнее
                                        </button>

                                    </div>

                                </div>

                            </div>

                        );
                    })}

                </div>
                {selectedTournament && (

                    <div
                        className={styles.modalOverlay}
                        onClick={() => setSelectedTournament(null)}
                    >

                        <div
                            className={styles.modal}
                            onClick={(e) => e.stopPropagation()}
                        >

                            <img
                                src={
                                    selectedTournament.posterUrl ||
                                    "https://images.unsplash.com/photo-1542751371-adc38448a05e"
                                }
                                alt={selectedTournament.title}
                                className={styles.modalPoster}
                            />

                            <div className={styles.modalContent}>

                                <div className={styles.modalTop}>

                    <span className={styles.modalGame}>
                        {selectedTournament.promotion?.title || "Tournament"}
                    </span>

                                    <button
                                        className={styles.closeBtn}
                                        onClick={() => setSelectedTournament(null)}
                                    >
                                        ✕
                                    </button>

                                </div>

                                <h2 className={styles.modalTitle}>
                                    {selectedTournament.title}
                                </h2>

                                <p className={styles.modalDescription}>
                                    {selectedTournament.description
                                        ? `Текущий счёт матча: ${selectedTournament.description}`
                                        : "Матч ещё не начался. Следите за обновлениями турнира и результатами команд."}
                                </p>

                                {/* ───────────────── META ───────────────── */}

                                <div className={styles.modalMeta}>

                                    <div className={styles.metaItem}>
                                        🎮 Игра:
                                        {" "}
                                        {selectedTournament.promotion?.title || "Unknown"}
                                    </div>

                                    <div className={styles.metaItem}>
                                        👥 Макс. команд:
                                        {" "}
                                        {selectedTournament.quantity}
                                    </div>

                                    <div className={styles.metaItem}>
                                        🧑‍🤝‍🧑 Участников:
                                        {" "}
                                        {selectedTournament.orders?.length ?? 0}
                                    </div>

                                    <div className={styles.metaItem}>
                                        📅 Дата:
                                        {" "}
                                        {new Date(
                                            selectedTournament.eventDate
                                        ).toLocaleDateString("ru-RU")}
                                    </div>

                                </div>

                                {/* ───────────────── SCORE ───────────────── */}

                                {selectedTournament.description && (

                                    <div className={styles.scoreBlock}>

                        <span className={styles.scoreLabel}>
                            LIVE SCORE
                        </span>

                                        <span className={styles.scoreValue}>
                            {selectedTournament.description}
                        </span>

                                    </div>

                                )}

                                {/* ───────────────── ACTIONS ───────────────── */}

                                <div className={styles.modalActions}>

                                    {!myTournamentIds.has(selectedTournament.id) ? (

                                        <button
                                            className={styles.registerBtn}
                                            onClick={() =>
                                                handleRegister(selectedTournament.id)
                                            }
                                        >
                                            Участвовать в турнире
                                        </button>

                                    ) : (

                                        <div className={styles.registered}>
                                            ✓ Вы участвуете в турнире
                                        </div>

                                    )}

                                    <button
                                        className={styles.detailsBtn}
                                        onClick={() => {
                                            toggleFavorite(selectedTournament.id);
                                        }}
                                    >
                                        {favorites.includes(selectedTournament.id)
                                            ? "★ В избранном"
                                            : "☆ Добавить в избранное"}
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )}
            </main>
            <Footer />
        </>

    );
};