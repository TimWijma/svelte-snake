import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { lobbyManager } from "$lib/server/lobbyStore";

export const GET: RequestHandler = async ({ params }) => {
    const { code } = params;
    const lobby = lobbyManager.lobbies.get(code);

    if (!lobby) {
        return new Response("Lobby not found", { status: 404 });
    }

    return json({
        code: lobby.code,
        players: lobby.players,
    });
};

export const POST: RequestHandler = async ({ request, params }) => {
    const { code } = params;
    const lobby = lobbyManager.lobbies.get(code);

    if (!lobby) {
        return new Response("Lobby not found", { status: 404 });
    }

    const { player } = await request.json();
    if (!player) {
        return new Response("Player name is required", { status: 400 });
    }

    if (lobby.join(player)) {
        return json({ success: true });
    } else {
        return new Response("Lobby is full", { status: 400 });
    }
};
