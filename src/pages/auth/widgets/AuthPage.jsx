import { useState } from "react";
import styles from "./AuthPage.module.css";
import {
    loginUser,
    registerUser,
} from "../api/api";

export const AuthPage = () => {

    const [mode, setMode] = useState("login");
    // login | register

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            // LOGIN

            if (mode === "login") {

                const user = await loginUser({
                    email: form.email,
                    password: form.password,
                });

                console.log(user);

                alert("Вы успешно вошли!");

                window.location.href = "/";

            }

            // REGISTER

            else {

                await registerUser({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    password: form.password,
                });

                alert("Аккаунт создан!");

                setMode("login");
            }

        } catch (error) {

            alert(error.message);

        } finally {

            setLoading(false);

        }
    };

    return (

        <main className={styles.page}>

            {/* BACKGROUND */}

            <div className={styles.blur1}></div>
            <div className={styles.blur2}></div>

            {/* CARD */}

            <div className={styles.card}>

                {/* HEADER */}

                <div className={styles.header}>

                    <span className={styles.badge}>
                        Esports Platform
                    </span>

                    <h1 className={styles.title}>
                        {mode === "login"
                            ? "Добро пожаловать"
                            : "Создать аккаунт"}
                    </h1>

                    <p className={styles.description}>
                        {mode === "login"
                            ? "Войдите в аккаунт для участия в турнирах"
                            : "Зарегистрируйтесь для участия в киберспортивных турнирах"}
                    </p>

                </div>

                {/* TABS */}

                <div className={styles.tabs}>

                    <button
                        className={`${styles.tab} ${
                            mode === "login"
                                ? styles.tabActive
                                : ""
                        }`}
                        onClick={() => setMode("login")}
                    >
                        Вход
                    </button>

                    <button
                        className={`${styles.tab} ${
                            mode === "register"
                                ? styles.tabActive
                                : ""
                        }`}
                        onClick={() => setMode("register")}
                    >
                        Регистрация
                    </button>

                </div>

                {/* FORM */}

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >

                    {mode === "register" && (

                        <div className={styles.row}>

                            <div className={styles.field}>

                                <label>
                                    Имя
                                </label>

                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Bogdan"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />

                            </div>

                            <div className={styles.field}>

                                <label>
                                    Фамилия
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Player"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />

                            </div>

                        </div>

                    )}

                    {/* EMAIL */}

                    <div className={styles.field}>

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="example@gmail.com"
                            value={form.email}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className={styles.field}>

                        <label>
                            Пароль
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />

                    </div>

                    {/* BUTTON */}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading
                            ? "Загрузка..."
                            : mode === "login"
                                ? "Войти"
                                : "Создать аккаунт"}
                    </button>

                </form>

            </div>

        </main>
    );
};