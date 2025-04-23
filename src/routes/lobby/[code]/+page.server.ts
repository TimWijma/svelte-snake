import { Fetch } from "$lib/Fetch";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const { code } = params;

    const lobby = await Fetch.get(`/api/lobby/${code}`).catch((error) => {
        console.error("Error fetching lobby data:", error);
        throw error;
    });

    return {
        lobby,
    };
};
