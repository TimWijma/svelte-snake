<script lang="ts">
    const gridHeight = 10;
    const gridWidth = 20;

    let grid = Array(gridHeight * gridWidth).fill(null);

    let snake = [22, 21, 20];
    let direction = 1;

    const getFood = () => {
        let newFood = Math.floor(Math.random() * grid.length);

        while (snake.includes(newFood)) {
            newFood = Math.floor(Math.random() * grid.length);
        }

        return newFood;
    };

    let food = getFood();

    let lastUpdateTime = 0;
    const moveDelay = 125;
    let inputQueue: number[] = [1];
    let isGameRunning = false;

    // Change direction with arrow keys
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

    const startGame = () => {
        snake = [22, 21, 20];
        direction = 1;
        inputQueue = [1];
        isGameRunning = true;
        lastUpdateTime = performance.now();
        requestAnimationFrame(gameLoop);
    };

    const endGame = () => {
        isGameRunning = false;
        alert("Game Over!");
    };

    // Move snake
    const moveSnake = () => {
        const head = snake[0] + direction;

        // Check for collisions
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

    // Listen for arrow key presses
    window.addEventListener("keydown", changeDirection);

    // Reactive grid updates
    // $: grid = grid.map((_, index) =>
    //     snake.includes(index)
    //         ? "snake" // Snake cells
    //         : index === food
    //           ? "food" // Food cell
    //           : null
    // );
</script>

<div
    class="grid"
    style="--grid-width: {gridWidth}; --grid-height: {gridHeight}"
>
    {#each grid as cell, index}
        {#if snake.includes(index)}
            {#if index === snake[0]}
                <div class="cell snake head"></div>
            {:else}
                <div class="cell snake"></div>
            {/if}
        {:else if index === food}
            <div class="cell food"></div>
        {:else}
            <div class="cell"></div>
        {/if}
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
    .cell.food {
        background-color: red;
    }
    button {
        margin-top: 10px;
    }
</style>
