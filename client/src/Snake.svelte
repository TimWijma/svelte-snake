<script lang="ts">
    import { Player } from "./lib/Player";

    export let players: Player[] = [];

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

        if (e.key === "ArrowUp" && lastDirection !== gridWidth) newDirection = -gridWidth;
        if (e.key === "ArrowDown" && lastDirection !== -gridWidth) newDirection = gridWidth;
        if (e.key === "ArrowLeft" && lastDirection !== 1) newDirection = -1;
        if (e.key === "ArrowRight" && lastDirection !== -1) newDirection = 1;

        if (newDirection !== lastDirection) {
            inputQueue.push(newDirection);
        }
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

    const startGame = () => {
        snake = [2, 1, 0];
        direction = 1;
        food = getFood();
        isGameRunning = true;
        lastUpdateTime = performance.now();
        requestAnimationFrame(gameLoop);
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

    const getCellClass = (index: number, snake: number[], food: number) => {
        if (snake.includes(index)) {
            if (index === snake[0]) {
                return "cell snake head";
            }
            return "cell snake";
        } else if (index === food) {
            return "cell food";
        }
        return "cell";
    };
</script>

<svelte:window on:keydown={changeDirection} />

<div class="grid" style="--grid-width: {gridWidth}; --grid-height: {gridHeight}">
    {#each grid as cell, index}
        <div class={getCellClass(index, snake, food)}></div>
    {/each}
</div>

<button on:click={startGame}>Start Game</button>

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
    .cell.snake {
        background-color: green;
    }
    .cell.snake.head {
        background-color: darkgreen;
    }
    .cell.food {
        background-color: red;
    }
    button {
        margin-top: 10px;
    }
</style>
