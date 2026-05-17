import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Создать матч в турнире
router.post("/", asyncHandler(async (req, res) => {
    const { tournamentId, team1, team2 } = req.body;

    if (!tournamentId || !team1 || !team2) {
        return res.status(400).json({ message: "Поля tournamentId, team1, team2 обязательны" });
    }

    const match = await prisma.match.create({
        data: {
            tournamentId: Number(tournamentId),
            team1,
            team2,
            score1: 0,
            score2: 0,
            status: "UPCOMING",
        },
    });

    res.status(201).json(match);
}));

// Получить все матчи турнира
router.get("/tournament/:tournamentId", asyncHandler(async (req, res) => {
    const matches = await prisma.match.findMany({
        where: { tournamentId: Number(req.params.tournamentId) },
        orderBy: { createdAt: "asc" },
    });

    res.json(matches);
}));

// Обновить счёт и статус матча
router.put("/:id", asyncHandler(async (req, res) => {
    const { score1, score2, status } = req.body;

    const match = await prisma.match.update({
        where: { id: Number(req.params.id) },
        data: {
            score1: score1 !== undefined ? Number(score1) : undefined,
            score2: score2 !== undefined ? Number(score2) : undefined,
            status,
        },
    });

    res.json(match);
}));

// Удалить матч
router.delete("/:id", asyncHandler(async (req, res) => {
    await prisma.match.delete({ where: { id: Number(req.params.id) } });
    res.sendStatus(204);
}));

export default router;
