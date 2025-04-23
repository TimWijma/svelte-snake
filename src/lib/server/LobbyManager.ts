import { Lobby } from "./Lobby";

export class LobbyManager {
    lobbies: Map<string, Lobby> = new Map();

    createLobby(): Lobby {
        const code = this.generateLobbyCode();
        const lobby = new Lobby(code, this);
        this.lobbies.set(code, lobby);

        return lobby;
    }

    removeLobby(code: string): void {
        const lobby = this.lobbies.get(code);
        if (lobby) {
            lobby.destroy();
            this.lobbies.delete(code);
        }
    }

    private generateLobbyCode(): string {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }
}
