<script lang="ts">
    import { goto } from "$app/navigation";
    import { Fetch } from "$lib/Fetch.js";
    import { usernameStore } from "$lib/stores.js";

    let { data } = $props();
    let { lobby } = data;

    const leaveLobby = async () => {
        await Fetch.delete(`/api/lobby/${lobby.code}`, {
            player: $usernameStore,
        })
            .then(() => {
                goto("/");
            })
            .catch((error) => {
                console.error("Error leaving lobby:", error);
            });
    };
</script>

<div class="lobby">
    <h2>{lobby.code}</h2>
    <p>Players: {lobby.players.length}</p>
    {#each lobby.players as player}
        <p>{player}</p>
    {/each}

    <button on:click={leaveLobby}>Leave Lobby</button>
</div>
