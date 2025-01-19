<script lang="ts">
    import { Game } from "./lib/Game";
    import { SocketManager } from "./lib/SocketManager";

    export let game: Game;
    export let socketManager: SocketManager;

    $effect(() => {
        game.grid = [...game.grid];
    });

    const changeDirection = (e: { key: string }) => {
        let newDirection: number = game.direction;

        if (e.key === "ArrowUp") newDirection = -game.width;
        if (e.key === "ArrowDown") newDirection = game.width;
        if (e.key === "ArrowLeft") newDirection = -1;
        if (e.key === "ArrowRight") newDirection = 1;

        if (newDirection !== -game.direction) {
            socketManager.move(newDirection);
            game.direction = newDirection;
        }
    };

    const snakeColorMap: { [key: string]: string } = {
        H: "darkgreen",
        S: "green",
        P: "darkblue",
        B: "blue",
        F: "red",
        O: "lightgray",
    };
</script>

<svelte:window on:keydown={changeDirection} />

<div
    class="grid"
    style="--grid-width: {game.width}; --grid-height: {game.height}"
>
    {#each game.grid as cell}
        <div
            class="cell"
            style="background-color: {snakeColorMap[cell] || 'lightgray'}"
        ></div>
    {/each}
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(var(--grid-width), 1fr);
        width: 200px;
        height: 200px;
        gap: 2px;
    }
    .cell {
        width: 100%;
        aspect-ratio: 1;
        background-color: lightgray;
    }
</style>
