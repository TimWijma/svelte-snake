import express, { Request, Response } from "express";
import { createServer } from "node:http";
import cors from "cors";
import { Lobby } from "./Lobby";
import { LobbyManager } from "./LobbyManager";
import { LobbyJoinRequest } from "./types";

const app = express();
const server = createServer(app);

const lobbyManager = new LobbyManager();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("hello world!");
});

app.get("/lobby", (req: Request, res: Response) => {
    const lobbies = Array.from(lobbyManager.lobbies.values()).map((lobby) => ({
        code: lobby.code,
        players: lobby.players,
    }));
    res.json(lobbies);
});

app.get("/lobby/:code", (req: Request, res: Response) => {
    const { code } = req.params;
    const lobby = lobbyManager.lobbies.get(code);

    if (!lobby) {
        res.status(404).json({ error: "Lobby not found" });
        return;
    }

    res.json({
        code: lobby.code,
        players: lobby.players,
    });
});

app.post("/lobby", (req: Request, res: Response) => {
    const lobby = lobbyManager.createLobby();
    res.json({ code: lobby.code });
});

app.post("/lobby/join", (req: Request<{}, {}, LobbyJoinRequest>, res: Response) => {
    const { code, player } = req.body;
    const lobby = lobbyManager.lobbies.get(code);

    if (!lobby) {
        res.status(404).json({ error: "Lobby not found" });
        return;
    }

    if (lobby.join(player)) {
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Lobby is full" });
    }
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
