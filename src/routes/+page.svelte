<script lang="ts">
    import { afterNavigate, goto, invalidate } from "$app/navigation";
    import { Fetch } from "$lib/Fetch.js";
    import { onMount } from "svelte";
    import { usernameStore } from "../lib/stores.js";

    let { data } = $props();
    let { lobbies } = data;

    console.log("lobbies", lobbies);

    const refreshLobbies = async () => {
        await invalidate("/api/lobby");
    };

    afterNavigate(() => {
        refreshLobbies();
    });

    const createLobby = async () => {
        await Fetch.post("/api/lobby", {
            player: $usernameStore,
        })
            .then((response: Lobby) => {
                let { code } = response;

                goto(`/lobby/${code}`);
            })
            .catch((error) => {
                console.error("Error creating lobby:", error);
            });
    };

    const joinLobby = async (code: string) => {
        await Fetch.post(`/api/lobby/${code}`, { player: $usernameStore })
            .then(() => {
                goto(`/lobby/${code}`);
            })
            .catch((error) => {
                console.error("Error joining lobby:", error);
            });
    };
</script>

<input
    type="text"
    bind:value={$usernameStore}
    placeholder="Enter your name"
    on:input={() => localStorage.setItem("username", $usernameStore)}
/>

{#each lobbies as lobby}
    <div class="lobby" on:click={() => joinLobby(lobby.code)}>
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
