import { LobbyManager } from "./LobbyManager";

export class Lobby {
    code: string;
    players: string[];
    maxPlayers: number = 2;

    private lobbyManager: LobbyManager;

    constructor(code: string, lobbyManager: LobbyManager) {
        this.code = code;
        this.players = [];

        this.lobbyManager = lobbyManager;

        console.log(`Lobby ${this.code} created`);
    }

    join(player: string) {
        if (this.players.includes(player)) {
            console.log(`Player ${player} is already in lobby ${this.code}`);
            return true;
        }

        if (this.players.length < this.maxPlayers) {
            this.players.push(player);
            console.log(`Player ${player} joined lobby ${this.code}`);
            return true;
        }

        console.log(`Player ${player} failed to join lobby ${this.code}: lobby is full`);

        return false;
    }

    leave(player: string) {
        this.players = this.players.filter((p) => p !== player);

        if (this.players.length === 0) {
            this.lobbyManager.removeLobby(this.code);
        }

        console.log(`Player ${player} left lobby ${this.code}`);
    }

    destroy() {
        console.log(`Lobby ${this.code} destroyed`);
    }
}
