const BASE_URL = "/api";



// ─── Турниры (Ticket) ────────────────────────────────────────────────────────
// title       = название турнира
// description = счёт матча, например "2:1"
// price       = 0
// eventDate   = дата турнира
// posterUrl   = картинка
// quantity    = макс. количество команд
// promotionId = id игры (Valorant, CS2 и т.д.)

export const getAllTournaments = async () => {
    const res = await fetch(`${BASE_URL}/tickets`);
    if (!res.ok) throw new Error("Ошибка загрузки турниров");
    return res.json();
};

export const getTournamentById = async (id) => {
    const res = await fetch(`${BASE_URL}/tickets/${id}`);
    if (!res.ok) throw new Error("Турнир не найден");
    return res.json();
};

export const createTournament = async ({ title, description, eventDate, posterUrl, quantity, promotionId }) => {
    const res = await fetch(`${BASE_URL}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            description: description || "",
            price: 0,
            eventDate: eventDate || new Date().toISOString(),
            posterUrl: posterUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e",
            quantity: Number(quantity) || 8,
            promotionId: Number(promotionId),
        }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Ошибка создания турнира");
    }
    return res.json();
};

export const updateTournamentScore = async (id, score) => {
    const res = await fetch(`${BASE_URL}/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: score }),
    });
    if (!res.ok) throw new Error("Ошибка обновления счёта");
    return res.json();
};

export const deleteTournament = async (id) => {
    const res = await fetch(`${BASE_URL}/tickets/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Ошибка удаления турнира");
};

// ─── Матчи (Cart) ────────────────────────────────────────────────────────────
// ticketId = id турнира
// userId   = участник/команда
// quantity = счёт (число, например 2)

export const getMatchesByTournament = async (tournamentId) => {
    const res = await fetch(`${BASE_URL}/cart/${tournamentId}`);
    if (!res.ok) throw new Error("Ошибка загрузки матчей");
    return res.json();
};

export const createMatch = async ({ ticketId, userId, quantity }) => {
    const res = await fetch(`${BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ticketId: Number(ticketId),
            userId: Number(userId),
            quantity: Number(quantity) || 0,
        }),
    });
    if (!res.ok) throw new Error("Ошибка создания матча");
    return res.json();
};

export const updateMatchScore = async (matchId, score) => {
    const res = await fetch(`${BASE_URL}/cart/${matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Number(score) }),
    });
    if (!res.ok) throw new Error("Ошибка обновления счёта");
    return res.json();
};

export const deleteMatch = async (matchId) => {
    const res = await fetch(`${BASE_URL}/cart/${matchId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Ошибка удаления матча");
};

// ─── Регистрация на турнир (Order) ───────────────────────────────────────────
// ticketId   = id турнира
// userId     = id пользователя
// quantity   = 1
// totalPrice = 0
export const registerForTournament = async (
    tournamentId
) => {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/orders`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
                ticketId: tournamentId,
                quantity: 1,
                totalPrice: 0,
            }),
        }
    );

    if (!res.ok) {

        const err = await res.json();

        throw new Error(
            err.message || "Ошибка регистрации"
        );
    }

    return res.json();
};

export const getMyRegistrations = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/orders/my`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error(
            "Ошибка загрузки регистраций"
        );
    }

    return res.json();
};

// ─── Игры/Категории (Promotion) ──────────────────────────────────────────────
// title = название игры (Valorant, CS2, Dota 2 ...)

export const getGames = async () => {
    const res = await fetch(`${BASE_URL}/promotions`);
    if (!res.ok) throw new Error("Ошибка загрузки игр");
    return res.json();
};

export const createGame = async (title) => {
    const res = await fetch(`${BASE_URL}/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: title, discount: 0 }),
    });
    if (!res.ok) throw new Error("Ошибка создания игры");
    return res.json();
};
