<script lang="ts">
    import { io, Socket } from "socket.io-client";
    import Snake from "./Snake.svelte";
    import { ClientPlayer, Player } from "./lib/Player";

    let players: Player[] = [];
    let joined = false;

    let socket: Socket;

    const setupSocketListeners = (socket: Socket) => {
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        socket.on("joined", () => {
            joined = true;
        });

        socket.on("users", (data: ClientPlayer[]) => {
            // players = data.map((name) => new Player(name));
            players = [];
            data.forEach((player) => {
                players.push(new Player(player.name, player.playerNumber));
            });
        });

        socket.on("full", () => {
            alert("Server is full");
            leave();
        });

        socket.on("start", () => {
            console.log("Game started");
        });
    };

    const join = () => {
        if (joined) return;

        socket?.removeAllListeners();
        socket?.disconnect();

        socket = io("http://localhost:3000");
        setupSocketListeners(socket);

        const name = prompt("Enter your name");
        if (name) socket.emit("join", name);
    };

    const leave = () => {
        socket.removeAllListeners();
        socket.disconnect();
        joined = false;
        players = [];
    };
</script>

<Snake bind:players />

{#if !joined}
    <h2>Join server</h2>
    <p>Click the button below to join the server</p>
    <button on:click={join}>Join server</button>
{:else}
    <h2>Joined server</h2>
    <p>You have joined the server</p>
    <button on:click={leave}>Leave server</button>
{/if}

{#if players.length > 0}
    <h2>Users</h2>
    <ul>
        {#each players as player}
            <li>{player.playerNumber}: {player.name}</li>
        {/each}
    </ul>
{/if}
