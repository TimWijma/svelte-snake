<script lang="ts">
    import { Socket } from "socket.io-client";
    import { Player } from "./lib/Player";

    export let players: Player[] = [];
    export let gameStateString: string;
    export let socket: Socket;

    $: gameState = gameStateString.split("");

    $: console.log(socket);

    const gridHeight = 10;
    const gridWidth = 10;

    let grid = Array(gridHeight * gridWidth).fill(null);

    let snake: number[] = [];
    let direction: number;
    let food: number;

    let lastUpdateTime = 0;
    const moveDelay = 125;
    let inputQueue: number[] = [1];
    let isGameRunning = false;

    const changeDirection = (e: { key: string }) => {
        const lastDirection = inputQueue[inputQueue.length - 1];
        let newDirection = lastDirection;

        if (e.key === "ArrowUp" && lastDirection !== gridWidth)
            newDirection = -gridWidth;
        if (e.key === "ArrowDown" && lastDirection !== -gridWidth)
            newDirection = gridWidth;
        if (e.key === "ArrowLeft" && lastDirection !== 1) newDirection = -1;
        if (e.key === "ArrowRight" && lastDirection !== -1) newDirection = 1;

        if (newDirection !== lastDirection) {
            inputQueue.push(newDirection);
        }

        socket.emit("direction", newDirection);
    };

    const gameLoop = (timestamp: number) => {
        if (!isGameRunning) return;

        if (timestamp - lastUpdateTime >= moveDelay) {
            direction = inputQueue[0];
            moveSnake();
            inputQueue = inputQueue.slice(1);

            if (inputQueue.length === 0) {
                inputQueue.push(direction);
            }

            lastUpdateTime = timestamp;
        }

        requestAnimationFrame(gameLoop);
    };

    const getFood = () => {
        let newFood = Math.floor(Math.random() * grid.length);

        while (snake.includes(newFood)) {
            newFood = Math.floor(Math.random() * grid.length);
        }

        return newFood;
    };

    const endGame = () => {
        isGameRunning = false;
        alert("Game Over!");
    };

    const moveSnake = () => {
        const head = snake[0] + direction;

        if (
            head < 0 ||
            head >= grid.length ||
            (direction === 1 && head % gridWidth === 0) ||
            (direction === -1 && head % gridWidth === gridWidth - 1) ||
            snake.includes(head)
        ) {
            endGame();
            return;
        }

        snake = [head, ...snake];

        if (head === food) {
            food = getFood();
        } else {
            snake.pop();
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
    style="--grid-width: {gridWidth}; --grid-height: {gridHeight}"
>
    {#each gameState as cell}
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
