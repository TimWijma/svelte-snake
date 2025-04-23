import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { Game } from "./snake";

export class ServerPlayer {
    constructor(public id: string, public name: string, public playerNumber: number) {}
}

const users: ServerPlayer[] = [];

let game: Game;

const app = express();
const server = createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        const user = users.find((user) => user.id === socket.id);
        if (user) {
            users.splice(users.indexOf(user), 1);
            console.log(`User ${user.name} left`);

            for (let i = 0; i < users.length; i++) {
                users[i].playerNumber = i + 1;
            }
        }
    });

    socket.on("move", (direction: number) => {
        if (!game || game.finished) return;

        const user = users.find((user) => user.id === socket.id);
        console.log("User", user?.name, "changed direction to", direction);

        if (user) {
            let player = game.getPlayer(user.playerNumber);
            // game.getPlayer(user.playerNumber)?.setDirection(direction);

            if (player) {
                player.setDirection(direction);
                console.log("Player", user.playerNumber, "changed direction to", direction);
            }
        }
    });
});

const startGame = () => {
    game = new Game(10, 10, users);
    game.start();

    let gameLoop = setInterval(() => {
        io.emit("state", game.getState());

        game.nextFrame();

        if (game.finished) {
            clearInterval(gameLoop);
        }
    }, 125);
};
