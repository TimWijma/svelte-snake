import express from "express";
import { createServer } from "node:http";
import { Server } from 'socket.io';
import * as cors from "cors";

const app = express();
const server = createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) => {
    res.send("hello world!");
});

io.on("connection", (socket) => {
    console.log("A user connected");
})

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
