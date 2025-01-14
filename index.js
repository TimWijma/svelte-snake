"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var node_http_1 = require("node:http");
var socket_io_1 = require("socket.io");
var cors = require("cors");
var app = (0, express_1.default)();
var server = (0, node_http_1.createServer)(app);
app.use(cors());
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
app.get("/", function (req, res) {
    res.send("hello world!");
});
io.on("connection", function (socket) {
    console.log("A user connected");
});
server.listen(3000, function () {
    console.log("server running at http://localhost:3000");
});
