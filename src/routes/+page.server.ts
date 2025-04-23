import type { PageServerLoad } from "./$types";

interface Lobby {
    code: string;
    players: string[];
}

export const load: PageServerLoad = async ({ fetch }) => {
    const response = await fetch("/api/lobby");
    if (!response.ok) {
        throw new Error("Failed to fetch lobby data");
    }
    const data: Lobby[] = await response.json();
    return { lobbies: data };
};
