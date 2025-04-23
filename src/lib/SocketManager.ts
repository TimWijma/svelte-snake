import { io, Socket } from "socket.io-client";
import { Game } from "./Game";
import { Player } from "./Player";

export class SocketManager {
    socket: Socket;
    game: Game;

    constructor(url: string, game: Game) {
        this.socket = io(url);
        this.game = game;

        this.socket.on("connect", this.connected.bind(this));
        this.socket.on("disconnect", this.disconnected.bind(this));
        this.socket.on("users", this.users.bind(this));
        this.socket.on("full", this.full.bind(this));
        this.socket.on("start", this.start.bind(this));
        this.socket.on("state", this.state.bind(this));
    }

    connected() {
        console.log("Connected to server");
    }

    disconnected() {
        console.log("Disconnected from server");
    }

    users(players: Player[]) {
        console.log("Users:", players);
        this.game.players = players;
    }

    full() {
        console.log("Game is full");
        alert("Game is full");
    }

    start() {
        console.log("Game started");
    }

    state(grid: string) {
        this.game.setState(grid);
    }

    join(name: string) {
        this.socket.emit("join", name);
    }

    leave() {
        this.socket.emit("leave");

        this.socket.disconnect();
    }

    move(direction: number) {
        this.socket.emit("move", direction);
    }
}
