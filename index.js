import express from "express";
import { join } from "path";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "http://localhost";
const projport = { AudioSphere: 4001, GeminiChat: 4002, QuoteGen: 4003 };

const server = express();
server.set("view engine", "ejs");
server.set("views", join(process.cwd(), "views"));
server.get("/", (req, res) => res.render("index", { projport, HOST }));
server.get("/QuoteGen", (req, res) => res.redirect(`${HOST}:${projport.QuoteGen}`));
server.get("/GeminiChat", (req, res) => res.redirect(`${HOST}:${projport.GeminiChat}`));
server.get("/AudioSphere", (req, res) => res.redirect(`${HOST}:${projport.AudioSphere}`));
server.listen(PORT, () => console.log("@ready...."));
