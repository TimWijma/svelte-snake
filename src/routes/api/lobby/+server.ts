import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { lobbyManager } from "$lib/server/lobbyStore";

export const GET: RequestHandler = async () => {
    const lobbies = Array.from(lobbyManager.lobbies.values()).map((lobby) => ({
        code: lobby.code,
        players: lobby.players,
    }));

    return json(lobbies);
};

export const POST: RequestHandler = async ({ request }) => {
    const { player } = await request.json();

    const lobby = lobbyManager.createLobby();

    lobby.join(player);

    return json({ code: lobby.code });
};
