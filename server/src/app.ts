import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

class User {
    constructor(public id: string, public name: string) {}
}

const users: User[] = [];

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
        }

        io.emit("users", users.map((user) => user.name));
    });

    socket.on("join", (name: string) => {
        const user = new User(socket.id, name);
        users.push(user);
        console.log(`User ${name} joined`);

        console.log("Users: ", users.map((user) => user.name).join(", "));

        socket.emit("joined", user.name);
        io.emit("users", users.map((user) => user.name));
    });

    socket.on("message", (message) => {
        console.log(message);
    });
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
