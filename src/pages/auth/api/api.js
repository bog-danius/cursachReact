const BASE_URL = "http://localhost:4200/api";

// ─────────────────────────────────────────────
// TOKEN
// ─────────────────────────────────────────────

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

const request = async (
    url,
    options = {}
) => {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
        `${BASE_URL}${url}`,
        {
            ...options,
            headers,
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            data.message || "Ошибка сервера"
        );
    }

    return data;
};

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export const registerUser = async (userData) => {

    const data = await request(
        "/users/register",
        {
            method: "POST",
            body: JSON.stringify(userData),
        }
    );

    localStorage.setItem(
        "token",
        data.token
    );

    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );

    return data;
};

export const loginUser = async (userData) => {

    const data = await request(
        "/users/login",
        {
            method: "POST",
            body: JSON.stringify(userData),
        }
    );

    localStorage.setItem(
        "token",
        data.token
    );

    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );

    return data;
};

// ─────────────────────────────────────────────
// TOURNAMENTS
// ─────────────────────────────────────────────

export const getAllTournaments = () => {
    return request("/tickets");
};

export const getTournamentById = (id) => {
    return request(`/tickets/${id}`);
};

export const createTournament = (body) => {
    return request("/tickets", {
        method: "POST",
        body: JSON.stringify(body),
    });
};

export const deleteTournament = (id) => {
    return request(`/tickets/${id}`, {
        method: "DELETE",
    });
};

// ─────────────────────────────────────────────
// GAMES
// ─────────────────────────────────────────────

export const getGames = () => {
    return request("/promotions");
};

// ─────────────────────────────────────────────
// ORDERS / REGISTRATIONS
// ─────────────────────────────────────────────

export const registerForTournament = (
    tournamentId
) => {

    return request("/orders", {
        method: "POST",
        body: JSON.stringify({
            ticketId: tournamentId,
            quantity: 1,
            totalPrice: 0,
        }),
    });
};

export const getMyRegistrations = () => {
    return request("/orders/my");
};