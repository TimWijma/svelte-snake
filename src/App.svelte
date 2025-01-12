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

    let gameInterval: number;

    // Change direction with arrow keys
    const changeDirection = (e: { key: string }) => {
        if (e.key === "ArrowUp" && direction !== gridWidth)
            direction = -gridWidth;
        if (e.key === "ArrowDown" && direction !== -gridWidth)
            direction = gridWidth;
        if (e.key === "ArrowLeft" && direction !== 1) direction = -1;
        if (e.key === "ArrowRight" && direction !== -1) direction = 1;
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
            clearInterval(gameInterval);
            alert("Game Over!");
            return;
        }

        snake = [head, ...snake];

        if (head === food) {
            food = getFood();
        } else {
            snake.pop();
        }
    };

    const startGame = () => {
        clearInterval(gameInterval);
        snake = [22, 21, 20];

        direction = 1;
        gameInterval = setInterval(() => {
            moveSnake();
        }, 200); // Move every 200ms
    };

    // Listen for arrow key presses
    window.addEventListener("keydown", changeDirection);

    // Reactive grid updates
    $: grid = grid.map((_, index) =>
        snake.includes(index)
            ? "snake" // Snake cells
            : index === food
              ? "food" // Food cell
              : null
    );
</script>

<div
    class="grid"
    style="--grid-width: {gridWidth}; --grid-height: {gridHeight}"
>
    {#each grid as cell, index}
        <div class="cell {cell}"></div>
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
