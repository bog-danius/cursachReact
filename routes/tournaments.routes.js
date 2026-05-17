import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Создать турнир
router.post("/", asyncHandler(async (req, res) => {
    const { title, game, description, maxTeams, creatorId } = req.body;

    if (!title || !game || !creatorId) {
        return res.status(400).json({ message: "Поля title, game и creatorId обязательны" });
    }

    const tournament = await prisma.tournament.create({
        data: {
            title,
            game,
            description,
            maxTeams: maxTeams ? Number(maxTeams) : 8,
            creatorId: Number(creatorId),
        },
        include: { creator: { select: { firstName: true, lastName: true } }, matches: true },
    });

    res.status(201).json(tournament);
}));

// Получить все турниры
router.get("/", asyncHandler(async (req, res) => {
    const tournaments = await prisma.tournament.findMany({
        include: {
            creator: { select: { firstName: true, lastName: true } },
            matches: true,
        },
        orderBy: { createdAt: "desc" },
    });

    res.json(tournaments);
}));

// Получить активные турниры (для главной страницы)
router.get("/active", asyncHandler(async (req, res) => {
    const tournaments = await prisma.tournament.findMany({
        where: { status: "ACTIVE" },
        include: {
            creator: { select: { firstName: true, lastName: true } },
            matches: {
                where: { status: { in: ["LIVE", "FINISHED"] } },
                orderBy: { createdAt: "desc" },
                take: 3,
            },
        },
    });

    res.json(tournaments);
}));

// Получить турнир по id
router.get("/:id", asyncHandler(async (req, res) => {
    const tournament = await prisma.tournament.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            creator: { select: { firstName: true, lastName: true } },
            matches: { orderBy: { createdAt: "asc" } },
        },
    });

    if (!tournament) {
        return res.status(404).json({ message: "Турнир не найден" });
    }

    res.json(tournament);
}));

// Обновить статус турнира
router.put("/:id", asyncHandler(async (req, res) => {
    const { title, game, description, maxTeams, status } = req.body;

    const tournament = await prisma.tournament.update({
        where: { id: Number(req.params.id) },
        data: {
            title,
            game,
            description,
            maxTeams: maxTeams ? Number(maxTeams) : undefined,
            status,
        },
    });

    res.json(tournament);
}));

// Удалить турнир
router.delete("/:id", asyncHandler(async (req, res) => {
    await prisma.tournament.delete({ where: { id: Number(req.params.id) } });
    res.sendStatus(204);
}));

export default router;