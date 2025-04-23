import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    // Mock data - replace with your actual data source
    const lobbies = [
        { code: "ABC123", players: ["Player1", "Player2"] },
        { code: "XYZ789", players: ["Player3"] },
    ];

    return json(lobbies);
};
