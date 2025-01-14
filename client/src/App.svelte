<script lang="ts">
    import { io, Socket } from "socket.io-client";
    import Snake from "./Snake.svelte";

    let users: string[] = [];
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

        socket.on("users", (data: string[]) => {
            users = data;
        });
    };

    socket = io("http://localhost:3000");
    setupSocketListeners(socket);

    const join = () => {
        if (joined) return;

        socket.removeAllListeners();
        socket.disconnect();

        socket = io("http://localhost:3000");
        setupSocketListeners(socket);

        const name = prompt("Enter your name");
        if (name) {
            socket.emit("join", name);
        }
    };

    const leave = () => {
        socket.removeAllListeners();
        socket.disconnect();
        joined = false;
        users = [];
    };

    const sendMessage = () => {
        if (!socket?.connected) return;

        socket.emit("message", "Hello from client");
    };
</script>

<Snake />

<button on:click={sendMessage}>Send message</button>
{#if !joined}
    <h2>Join server</h2>
    <p>Click the button below to join the server</p>
    <button on:click={join}>Join server</button>
{:else}
    <h2>Joined server</h2>
    <p>You have joined the server</p>
    <button on:click={leave}>Leave server</button>
{/if}

{#if users.length > 0}
    <h2>Users</h2>
    <ul>
        {#each users as user}
            <li>{user}</li>
        {/each}
    </ul>
{/if}
