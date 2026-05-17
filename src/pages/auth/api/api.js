const BASE_URL = "/api";

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────

export const registerUser = async ({
                                       firstName,
                                       lastName,
                                       email,
                                       password,
                                   }) => {

    const res = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            data.message || "Ошибка регистрации"
        );
    }

    return data;
};

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────

export const loginUser = async ({
                                    email,
                                    password,
                                }) => {

    const res = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            data.message || "Ошибка входа"
        );
    }

    // сохраняем пользователя
    localStorage.setItem(
        "user",
        JSON.stringify(data)
    );

    return data;
};

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────

export const logoutUser = () => {

    localStorage.removeItem("user");

};

// ─────────────────────────────────────────────
// GET CURRENT USER
// ─────────────────────────────────────────────

export const getCurrentUser = () => {

    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;

};