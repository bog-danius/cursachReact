import bcrypt from "bcrypt";
import { prisma } from "../../prisma/prisma.js";
import { generateToken } from "../utils/generateToken.js";


// REGISTER

export const register = async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            password,
        } = req.body;

        const candidate = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (candidate) {
            return res.status(400).json({
                message: "Пользователь уже существует",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        });

        const token = generateToken(user);

        res.status(201).json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            token,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};


// LOGIN

export const login = async (req, res) => {

    try {

        const {
            email,
            password,
        } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(400).json({
                message: "Пользователь не найден",
            });
        }

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Неверный пароль",
            });
        }

        const token = generateToken(user);

        res.json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            token,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};


// ME

export const getMe = async (req, res) => {

    try {

        res.json({
            id: req.user.id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            role: req.user.role,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};