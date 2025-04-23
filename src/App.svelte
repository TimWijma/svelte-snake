<script lang="ts">
    import Snake from "./Snake.svelte";
    import { Game } from "./lib/Game";
    import { SocketManager } from "./lib/SocketManager";

    const SERVER_URL = "http://localhost:3000";

    let game: Game | null = null;
    let socketManager: SocketManager | null = null;

    let joined = false;

    const join = () => {
        const name = prompt("Enter your name");

        if (name) {
            game = new Game(10, 10);

            socketManager = new SocketManager(SERVER_URL, game);
            socketManager.join(name);

            joined = true;
        }
    };

    const leave = () => {
        socketManager?.leave();
        joined = false;

        game = null;
        socketManager = null;
    };
</script>

{#if game && socketManager}
    <Snake bind:game bind:socketManager />
{/if}

{#if !joined}
    <h2>Join server</h2>
    <p>Click the button below to join the server</p>
    <button on:click={join}>Join server</button>
{:else}
    <h2>Joined server</h2>
    <p>You have joined the server</p>
    <button on:click={leave}>Leave server</button>
{/if}

{#if game}
    {#if game.players && game.players.length > 0}
        <h2>Users</h2>
        <ul>
            {#each game.players as player}
                <li>{player.playerNumber}: {player.name}</li>
            {/each}
        </ul>
    {/if}
{/if}
