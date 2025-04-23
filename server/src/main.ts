import express from "express";
import { createServer } from "node:http";
import cors from "cors";

const app = express();
const server = createServer(app);

app.use(cors());

app.get("/", (req, res) => {
    res.send("hello world!");
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
