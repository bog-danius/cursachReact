import { useEffect, useState } from "react";
import { Header } from "@shared/Header";
import { Footer } from "@shared/Footer";
import styles from "./TournamentsPage.module.css";
import {
    getAllTournaments,
    createTournament,
    deleteTournament,
    getGames,
    createGame,
    registerForTournament,
    getMyRegistrations,
} from "../api/api.js";

// Заглушка — замени на реального авторизованного пользователя
const CURRENT_USER_ID = 1;

export const TournamentsPage = () => {
    const [tournaments, setTournaments]     = useState([]);
    const [games, setGames]                 = useState([]);
    const [myRegs, setMyRegs]               = useState([]);
    const [loading, setLoading]             = useState(true);
    const [showForm, setShowForm]           = useState(false);
    const [submitting, setSubmitting]       = useState(false);
    const [tab, setTab]                     = useState("all"); // "all" | "my"
    const [form, setForm] = useState({
        title: "",
        promotionId: "",
        quantity: 8,
        eventDate: "",
        description: "",   // счёт, например "2:1"
        posterUrl: "",
    });

    const load = async () => {
        setLoading(true);
        try {
            const [t, g, r] = await Promise.all([
                getAllTournaments(),
                getGames(),
                getMyRegistrations(CURRENT_USER_ID),
            ]);
            setTournaments(Array.isArray(t) ? t : []);
            setGames(Array.isArray(g) ? g : []);
            // r может быть {message: "Заказы не найдены"} — обрабатываем
            setMyRegs(Array.isArray(r) ? r : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!form.title.trim())       return alert("Введите название");
        if (!form.promotionId)        return alert("Выберите игру");
        if (!form.eventDate)          return alert("Укажите дату");

        setSubmitting(true);
        try {
            await createTournament({
                ...form,
                quantity: Number(form.quantity) || 8,
                promotionId: Number(form.promotionId),
            });
            setShowForm(false);
            setForm({ title: "", promotionId: "", quantity: 8, eventDate: "", description: "", posterUrl: "" });
            load();
        } catch (e) {
            alert(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegister = async (tournamentId) => {
        try {
            await registerForTournament({ ticketId: tournamentId, userId: CURRENT_USER_ID });
            alert("Вы зарегистрированы!");
            load();
        } catch (e) {
            alert(e.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Удалить турнир?")) return;
        try {
            await deleteTournament(id);
            setTournaments((prev) => prev.filter((t) => t.id !== id));
        } catch (e) {
            alert(e.message);
        }
    };

    // id турниров на которые я зарегистрирован
    const myTournamentIds = new Set(myRegs.map((r) => r.ticketId));

    const displayed = tab === "my"
        ? tournaments.filter((t) => myTournamentIds.has(t.id))
        : tournaments;

    return (
        <>
            <Header />
            <main className={styles.page}>

                {/* ── Заголовок ─────────────────────────────────── */}
                <div className={styles.pageHeader}>
                    <div>
                        <span className={styles.subtitle}>Соревнования</span>
                        <h1 className={styles.title}>Турниры</h1>
                    </div>
                    <button
                        className={styles.createBtn}
                        onClick={() => setShowForm((v) => !v)}
                    >
                        {showForm ? "✕ Отмена" : "+ Создать турнир"}
                    </button>
                </div>

                {/* ── Форма создания ────────────────────────────── */}
                {showForm && (
                    <div className={styles.formCard}>
                        <h2 className={styles.formTitle}>Новый турнир</h2>
                        <div className={styles.formGrid}>

                            <div className={styles.field}>
                                <label>Название *</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Valorant Championship"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Игра *</label>
                                <select
                                    name="promotionId"
                                    value={form.promotionId}
                                    onChange={handleChange}
                                    className={styles.input}
                                >
                                    <option value="">— Выбери игру —</option>
                                    {games.map((g) => (
                                        <option key={g.id} value={g.id}>{g.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label>Макс. команд</label>
                                <input
                                    name="quantity"
                                    type="number"
                                    min={2}
                                    max={64}
                                    value={form.quantity}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Дата турнира *</label>
                                <input
                                    name="eventDate"
                                    type="datetime-local"
                                    value={form.eventDate}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Счёт (например: 2:1)</label>
                                <input
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="2:1"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Ссылка на постер</label>
                                <input
                                    name="posterUrl"
                                    value={form.posterUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className={styles.input}
                                />
                            </div>

                        </div>

                        <button
                            className={styles.submitBtn}
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? "Создаём..." : "Создать турнир"}
                        </button>
                    </div>
                )}

                {/* ── Табы ──────────────────────────────────────── */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${tab === "all" ? styles.tabActive : ""}`}
                        onClick={() => setTab("all")}
                    >
                        Все турниры
                    </button>
                    <button
                        className={`${styles.tab} ${tab === "my" ? styles.tabActive : ""}`}
                        onClick={() => setTab("my")}
                    >
                        Мои турниры
                    </button>
                </div>

                {/* ── Список ────────────────────────────────────── */}
                {loading && <p className={styles.state}>Загрузка...</p>}

                {!loading && displayed.length === 0 && (
                    <p className={styles.state}>
                        {tab === "my" ? "Вы не зарегистрированы ни в одном турнире" : "Турниров пока нет"}
                    </p>
                )}

                <div className={styles.grid}>
                    {displayed.map((t) => {
                        const isRegistered = myTournamentIds.has(t.id);
                        return (
                            <div key={t.id} className={styles.card}>

                                {t.posterUrl && (
                                    <img
                                        src={t.posterUrl}
                                        alt={t.title}
                                        className={styles.poster}
                                    />
                                )}

                                <div className={styles.cardBody}>
                                    <div className={styles.cardTop}>
                                        <span className={styles.game}>
                                            {t.promotion?.title ?? "Турнир"}
                                        </span>
                                        <span className={styles.cardDate}>
                                            {new Date(t.eventDate).toLocaleDateString("ru-RU")}
                                        </span>
                                    </div>

                                    <h3 className={styles.cardTitle}>{t.title}</h3>

                                    {/* Счёт из description */}
                                    {t.description ? (
                                        <div className={styles.scoreBlock}>
                                            <span className={styles.scoreLabel}>Счёт</span>
                                            <span className={styles.scoreValue}>{t.description}</span>
                                        </div>
                                    ) : (
                                        <p className={styles.noScore}>Матч ещё не начался</p>
                                    )}

                                    <div className={styles.meta}>
                                        <span>👥 Макс. команд: {t.quantity}</span>
                                        <span>🎮 {t.orders?.length ?? 0} участников</span>
                                    </div>

                                    <div className={styles.cardActions}>
                                        {!isRegistered ? (
                                            <button
                                                className={styles.registerBtn}
                                                onClick={() => handleRegister(t.id)}
                                            >
                                                Участвовать
                                            </button>
                                        ) : (
                                            <span className={styles.registered}>✓ Вы участвуете</span>
                                        )}

                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(t.id)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </main>
            <Footer />
        </>
    );
};
