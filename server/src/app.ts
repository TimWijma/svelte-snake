import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { Game } from "./snake";

export class ServerPlayer {
    constructor(
        public id: string,
        public name: string,
        public playerNumber: number
    ) {}
}
class ClientPlayer {
    constructor(public name: string, public playerNumber: number) {}
}

const users: ServerPlayer[] = [];

let game: Game;
let gameLoop;

const app = express();
const server = createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.get("/", (req, res) => {
    res.send("hello world!");
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

        sendUsers();
    });

    socket.on("join", (name: string) => {
        if (users.length >= 2) {
            socket.emit("full");
            return;
        }

        const user = new ServerPlayer(socket.id, name, users.length + 1);
        users.push(user);
        console.log(`User ${name} joined`);

        console.log("Users: ", users.map((user) => user.name).join(", "));

        socket.emit("joined", user.name);
        sendUsers();

        if (users.length === 2) {
            io.emit("start");
            startGame();
        }
    });
});

const sendUsers = () => {
    io.emit("users", users);
};

const startGame = () => {
    game = new Game(10, 10, users);
    game.start();

    gameLoop = setInterval(() => {
        io.emit("gamestate", game.getState());
    }, 125);
};

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
