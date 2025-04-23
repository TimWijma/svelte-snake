<script lang="ts">
    import { Fetch } from "$lib/Fetch.js";

    let { data } = $props();
    let { lobbies } = data;

    const createLobby = async () => {
        await Fetch.post("/api/lobby")
            .then((response: Lobby) => {
                let { code } = response;

                window.location.href = `/lobby/${code}`;
            })
            .catch((error) => {
                console.error("Error creating lobby:", error);
            });
    };
</script>

{#each lobbies as lobby}
    <div class="lobby">
        <h2>{lobby.code}</h2>
        <p>Players: {lobby.players.length}</p>
        {#each lobby.players as player}
            <p>{player}</p>
        {/each}
    </div>
{/each}

<button on:click={createLobby}>Create Lobby</button>

<style>
    .lobby {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 10px 0;
    }

    h2 {
        margin: 0;
    }

    p {
        margin: 5px 0;
    }

    .lobby:hover {
        background-color: #f0f0f0;
    }
</style>
