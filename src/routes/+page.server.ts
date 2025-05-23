import { Fetch } from "$lib/Fetch";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({}) => {
    const lobbies = await Fetch.get("/api/lobby").catch((error) => {
        console.error("Error fetching lobby data:", error);
        throw error;
    });

    return {
        lobbies,
    };
};
