// prisma/seedUser.js
// Запуск:
// node prisma/seed.js

import bcrypt from "bcrypt";
import { prisma } from "./prisma.js";

async function main() {

    console.log("🌱 Заполнение пользователей...\n");

    // ─────────────────────────────────────────────
    // Очистка
    // ─────────────────────────────────────────────

    await prisma.orderDocument.deleteMany();
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.promotion.deleteMany();
    await prisma.user.deleteMany();

    console.log("🗑️ База очищена\n");

    // ─────────────────────────────────────────────
    // Хеширование паролей
    // ─────────────────────────────────────────────

    const password = await bcrypt.hash("123456", 10);

    // ─────────────────────────────────────────────
    // Пользователи
    // ─────────────────────────────────────────────

    const users = await prisma.user.createManyAndReturn({
        data: [

            // ADMIN

            {
                email: "admin@tourney.com",
                firstName: "Александр",
                lastName: "Смирнов",
                password,
                avatarUrl:
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
            },

            // USERS

            {
                email: "bogdan@gmail.com",
                firstName: "Богдан",
                lastName: "Коваленко",
                password,
                avatarUrl:
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
            },

            {
                email: "player1@gmail.com",
                firstName: "Дмитрий",
                lastName: "Козлов",
                password,
                avatarUrl:
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
            },

            {
                email: "player2@gmail.com",
                firstName: "Иван",
                lastName: "Петров",
                password,
                avatarUrl:
                    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300",
            },

            {
                email: "player3@gmail.com",
                firstName: "Анна",
                lastName: "Новикова",
                password,
                avatarUrl:
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
            },

            {
                email: "player4@gmail.com",
                firstName: "Сергей",
                lastName: "Фёдоров",
                password,
                avatarUrl:
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
            },

            {
                email: "esports@gmail.com",
                firstName: "Максим",
                lastName: "Орлов",
                password,
                avatarUrl:
                    "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300",
            },

            {
                email: "cybercat@gmail.com",
                firstName: "Екатерина",
                lastName: "Власова",
                password,
                avatarUrl:
                    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300",
            },

            {
                email: "ghost@gmail.com",
                firstName: "Никита",
                lastName: "Соколов",
                password,
                avatarUrl:
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
            },

            {
                email: "sniper@gmail.com",
                firstName: "Артём",
                lastName: "Белый",
                password,
                avatarUrl:
                    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300",
            },

        ],
    });

    console.log("👥 Пользователи созданы:\n");

    users.forEach((user) => {

        console.log(
            `• ${user.firstName} ${user.lastName} )`
        );

    });

    console.log("\n────────────────────────────");
    console.log(`✅ Всего пользователей: ${users.length}`);
    console.log("🔑 Пароль у всех: 123456");
    console.log("────────────────────────────\n");

}

main()
    .catch((e) => {

        console.error("❌ Ошибка:", e);

        process.exit(1);

    })
    .finally(async () => {

        await prisma.$disconnect();

    });