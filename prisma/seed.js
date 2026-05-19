// prisma/seed.js
// Запуск: node prisma/seed.js

import { prisma } from './prisma.js';

async function main() {
    console.log('🌱 Начинаем заполнение базы данных...\n');

    // ─── 1. Очистка (порядок важен из-за FK) ────────────────────────────────
    await prisma.orderDocument.deleteMany();
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.promotion.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  База очищена\n');

    // ─── 2. Promotion = Игры ─────────────────────────────────────────────────
    const games = await prisma.promotion.createManyAndReturn({
        data: [
            { title: 'Valorant',          description: 'Тактический шутер от Riot Games',         discount: 0 },
            { title: 'CS2',               description: 'Counter-Strike 2 от Valve',                discount: 0 },
            { title: 'Dota 2',            description: 'Легендарная MOBA от Valve',                discount: 0 },
            { title: 'League of Legends', description: 'MOBA от Riot Games',                       discount: 0 },
            { title: 'Fortnite',          description: 'Королевская битва от Epic Games',          discount: 0 },
        ],
    });

    const [valorant, cs2, dota2, lol, fortnite] = games;
    console.log('🎮 Игры добавлены:', games.map(g => g.title).join(', '));

    // ─── 3. User = Пользователи ──────────────────────────────────────────────
    const users = await prisma.user.createManyAndReturn({
        data: [
            { email: 'admin@tourney.com',  firstName: 'Александр', lastName: 'Смирнов',  password: 'hashed_pass_1' },
            { email: 'player1@gmail.com',  firstName: 'Дмитрий',   lastName: 'Козлов',   password: 'hashed_pass_2' },
            { email: 'player2@gmail.com',  firstName: 'Иван',      lastName: 'Петров',   password: 'hashed_pass_3' },
            { email: 'player3@gmail.com',  firstName: 'Анна',      lastName: 'Новикова', password: 'hashed_pass_4' },
            { email: 'player4@gmail.com',  firstName: 'Сергей',    lastName: 'Фёдоров',  password: 'hashed_pass_5' },
        ],
    });

    const [admin, player1, player2, player3, player4] = users;
    console.log('👥 Пользователи добавлены:', users.map(u => u.firstName).join(', '));

    // ─── 4. Ticket = Турниры ─────────────────────────────────────────────────
    // title       = название турнира
    // description = счёт матча ("2:1") или пусто если ещё не начался
    // price       = 0
    // quantity    = макс. команд
    // promotionId = id игры
    const tickets = await prisma.ticket.createManyAndReturn({
        data: [
            {
                title:       'Valorant Spring Cup 2026',
                description: '2:1',
                price:       0,
                eventDate:   new Date('2026-05-20T15:00:00'),
                posterUrl:   'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
                quantity:    16,
                promotionId: valorant.id,
            },
            {
                title:       'CS2 Pro League Season 3',
                description: '1:1',
                price:       0,
                eventDate:   new Date('2026-05-22T18:00:00'),
                posterUrl:   'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600',
                quantity:    8,
                promotionId: cs2.id,
            },
            {
                title:       'Dota 2 Champions League',
                description: '3:0',
                price:       0,
                eventDate:   new Date('2026-05-25T12:00:00'),
                posterUrl:   'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600',
                quantity:    16,
                promotionId: dota2.id,
            },
            {
                title:       'LoL Summer Invitational',
                description: '',
                price:       0,
                eventDate:   new Date('2026-06-01T16:00:00'),
                posterUrl:   'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600',
                quantity:    8,
                promotionId: lol.id,
            },
            {
                title:       'Fortnite Open 2026',
                description: '',
                price:       0,
                eventDate:   new Date('2026-06-10T14:00:00'),
                posterUrl:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
                quantity:    32,
                promotionId: fortnite.id,
            },
            {
                title:       'Valorant Masters Kiev',
                description: '0:2',
                price:       0,
                eventDate:   new Date('2026-05-18T20:00:00'),
                posterUrl:   'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
                quantity:    16,
                promotionId: valorant.id,
            },
        ],
    });

    const [t1, t2, t3, t4, t5, t6] = tickets;
    console.log('🏆 Турниры добавлены:', tickets.map(t => t.title).join(', '));

    // ─── 5. Cart = Матчи ─────────────────────────────────────────────────────
    // userId   = участник
    // ticketId = турнир
    // quantity = счёт участника в матче
    await prisma.cart.createMany({
        data: [
            // Турнир 1 — Valorant Spring Cup (счёт 2:1)
            { userId: player1.id, ticketId: t1.id, quantity: 2 },
            { userId: player2.id, ticketId: t1.id, quantity: 1 },

            // Турнир 2 — CS2 Pro League (счёт 1:1)
            { userId: player1.id, ticketId: t2.id, quantity: 1 },
            { userId: player3.id, ticketId: t2.id, quantity: 1 },

            // Турнир 3 — Dota 2 Champions (счёт 3:0)
            { userId: player2.id, ticketId: t3.id, quantity: 3 },
            { userId: player4.id, ticketId: t3.id, quantity: 0 },

            // Турнир 6 — Valorant Masters (счёт 0:2)
            { userId: player3.id, ticketId: t6.id, quantity: 0 },
            { userId: player4.id, ticketId: t6.id, quantity: 2 },
        ],
    });
    console.log('🎯 Матчи (Cart) добавлены');

    // ─── 6. Order = Регистрации на турниры ───────────────────────────────────
    await prisma.order.createMany({
        data: [
            { userId: player1.id, ticketId: t1.id, quantity: 1, totalPrice: 0 },
            { userId: player2.id, ticketId: t1.id, quantity: 1, totalPrice: 0 },
            { userId: player1.id, ticketId: t2.id, quantity: 1, totalPrice: 0 },
            { userId: player3.id, ticketId: t2.id, quantity: 1, totalPrice: 0 },
            { userId: player2.id, ticketId: t3.id, quantity: 1, totalPrice: 0 },
            { userId: player4.id, ticketId: t3.id, quantity: 1, totalPrice: 0 },
            { userId: player1.id, ticketId: t4.id, quantity: 1, totalPrice: 0 },
            { userId: player3.id, ticketId: t6.id, quantity: 1, totalPrice: 0 },
            { userId: player4.id, ticketId: t6.id, quantity: 1, totalPrice: 0 },
        ],
    });
    console.log('📋 Регистрации (Order) добавлены');

    // ─── 7. Favorite ─────────────────────────────────────────────────────────
    await prisma.favorite.createMany({
        data: [
            { userId: player1.id, ticketId: t1.id },
            { userId: player1.id, ticketId: t3.id },
            { userId: player2.id, ticketId: t2.id },
            { userId: player3.id, ticketId: t1.id },
            { userId: player4.id, ticketId: t6.id },
        ],
    });
    console.log('❤️  Избранное (Favorite) добавлено');

    console.log('\n✅ База данных успешно заполнена!');
    console.log('─────────────────────────────────');
    console.log(`🎮 Игр:          ${games.length}`);
    console.log(`👥 Пользователей:${users.length}`);
    console.log(`🏆 Турниров:     ${tickets.length}`);
    console.log(`🎯 Матчей:       8`);
    console.log(`📋 Регистраций:  9`);
    console.log(`❤️  Избранных:    5`);
}

main()
    .catch((e) => {
        console.error('❌ Ошибка:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


// prisma/seed.js
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
                role: "ADMIN",
                avatarUrl:
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
            },

            // USERS

            {
                email: "bogdan@gmail.com",
                firstName: "Богдан",
                lastName: "Коваленко",
                password,
                role: "USER",
                avatarUrl:
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
            },

            {
                email: "player1@gmail.com",
                firstName: "Дмитрий",
                lastName: "Козлов",
                password,
                role: "USER",
                avatarUrl:
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
            },

            {
                email: "player2@gmail.com",
                firstName: "Иван",
                lastName: "Петров",
                password,
                role: "USER",
                avatarUrl:
                    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300",
            },

            {
                email: "player3@gmail.com",
                firstName: "Анна",
                lastName: "Новикова",
                password,
                role: "USER",
                avatarUrl:
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
            },

            {
                email: "player4@gmail.com",
                firstName: "Сергей",
                lastName: "Фёдоров",
                password,
                role: "USER",
                avatarUrl:
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
            },

            {
                email: "esports@gmail.com",
                firstName: "Максим",
                lastName: "Орлов",
                password,
                role: "USER",
                avatarUrl:
                    "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300",
            },

            {
                email: "cybercat@gmail.com",
                firstName: "Екатерина",
                lastName: "Власова",
                password,
                role: "USER",
                avatarUrl:
                    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300",
            },

            {
                email: "ghost@gmail.com",
                firstName: "Никита",
                lastName: "Соколов",
                password,
                role: "USER",
                avatarUrl:
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
            },

            {
                email: "sniper@gmail.com",
                firstName: "Артём",
                lastName: "Белый",
                password,
                role: "USER",
                avatarUrl:
                    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300",
            },

        ],
    });

    console.log("👥 Пользователи созданы:\n");

    users.forEach((user) => {

        console.log(
            `• ${user.firstName} ${user.lastName} (${user.role})`
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