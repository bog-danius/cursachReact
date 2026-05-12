import express from "express";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";

import path from "path";
import { fileURLToPath } from "url";

import { prisma } from "./prisma/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const HOST = process.env.HOST || "192.168.50.214";
const PORT = process.env.PORT || 4200;

app.use(cors());

app.use(
	helmet({
		contentSecurityPolicy: false,
		hsts: false,
		crossOriginOpenerPolicy: {
			policy: "unsafe-none"
		}
	})
);

app.use(express.json());

app.use(express.static(path.join(__dirname, "FrontEnd")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "FrontEnd", "index.html"));
});



// ================= USERS =================

app.post("/api/users", async (req, res) => {
	try {
		const user = await prisma.user.create({
			data: req.body
		});

		res.json(user);

	} catch (err) {
		res.status(500).json({
			error: err.message
		});
	}
});

app.get("/api/users", async (req, res) => {
	const users = await prisma.user.findMany();

	res.json(users);
});

app.put("/api/users/:id", async (req, res) => {
	try {
		const user = await prisma.user.update({
			where: {
				id: Number(req.params.id)
			},
			data: req.body
		});

		res.json(user);

	} catch (err) {
		res.status(500).json({
			error: err.message
		});
	}
});

app.delete("/api/users/:id", async (req, res) => {
	try {
		await prisma.user.delete({
			where: {
				id: Number(req.params.id)
			}
		});

		res.sendStatus(204);

	} catch (err) {
		res.status(500).json({
			error: err.message
		});
	}
});



// ================= TICKETS =================

app.post("/api/tickets", async (req, res) => {
	try {
		const ticket = await prisma.ticket.create({
			data: {
				...req.body,
				dateTime: new Date(req.body.dateTime)
			}
		});

		res.json(ticket);

	} catch (err) {
		res.status(500).json({
			error: err.message
		});
	}
});

app.get("/api/tickets", async (req, res) => {
	const tickets = await prisma.ticket.findMany({
		include: {
			promotions: true
		}
	});

	res.json(tickets);
});



// ================= PROMOTIONS =================

app.post("/api/promotions", async (req, res) => {
	try {
		const promo = await prisma.promotion.create({
			data: {
				...req.body,
				validUntil: new Date(req.body.validUntil)
			}
		});

		res.json(promo);

	} catch (err) {
		res.status(500).json({
			error: err.message
		});
	}
});



// ================= CART =================

app.post("/api/cart", async (req, res) => {
	try {
		const item = await prisma.cart_Favorite.create({
			data: req.body
		});

		res.json(item);

	} catch (err) {
		res.status(500).json({
			error: err.message
		});
	}
});

app.get("/api/cart/:userId", async (req, res) => {
	const items = await prisma.cart_Favorite.findMany({
		where: {
			userId: Number(req.params.userId)
		},
		include: {
			ticket: true
		}
	});

	res.json(items);
});



// ================= ORDERS =================

app.post("/api/orders", async (req, res) => {
	try {
		const order = await prisma.web_Order.create({
			data: {
				userId: req.body.userId,
				totalAmount: req.body.totalAmount,

				history: {
					create: {}
				}
			}
		});

		res.json(order);

	} catch (err) {
		res.status(500).json({
			error: err.message
		});
	}
});

app.get("/api/orders", async (req, res) => {
	const orders = await prisma.web_Order.findMany({
		include: {
			user: true,
			history: true,
			reviews: true
		}
	});

	res.json(orders);
});



// ================= HISTORY =================

app.get("/api/history", async (req, res) => {
	const history = await prisma.history.findMany({
		include: {
			order: true
		}
	});

	res.json(history);
});



// ================= REVIEWS =================

app.post("/api/reviews", async (req, res) => {
	try {
		const review = await prisma.review.create({
			data: req.body
		});

		res.json(review);

	} catch (err) {
		res.status(500).json({
			error: err.message
		});
	}
});

app.get("/api/reviews", async (req, res) => {
	const reviews = await prisma.review.findMany({
		include: {
			user: true
		}
	});

	res.json(reviews);
});



// ================= GLOBAL ERROR =================

app.use((err, req, res, next) => {
	console.error(err);

	res.status(500).json({
		error: err.message
	});
});



// ================= START =================

app.listen(PORT, HOST, () => {
	console.log(`🚀 Server: http://${HOST}:${PORT}`);
});