import { ServerPlayer } from "./app";

class Player {
    snake: number[] = [];
    direction: number = 1;
    playerNumber: number = 0;

    setDirection(direction: number) {
        this.direction = direction;
    }
}

export class Game {
    gridHeight: number = 10;
    gridWidth: number = 10;
    grid: number[] = [];

    players: Player[] = [];

    food: number = 0;

    finished = false;

    constructor(height: number, width: number, players: ServerPlayer[]) {
        this.gridHeight = height;
        this.gridWidth = width;
        this.grid = Array(height * width).fill(null);

        this.players = players.map(() => new Player());
    }

    getPlayer(playerNumber: number): Player | null {
        let player = this.players.find(
            (player) => player.playerNumber === playerNumber
        );

        return player || null;
    }

    start(): void {
        if (this.players.length != 2) {
            console.error("Game needs 2 players to start");
            return;
        }

        this.players[0].snake = [2, 1, 0];
        this.players[0].direction = 1;
        this.players[1].snake = [97, 98, 99];
        this.players[1].direction = -1;

        this.getFood();
    }

    getFood() {
        let newFood = Math.floor(Math.random() * this.grid.length);

        while (
            this.players[0].snake.includes(newFood) ||
            this.players[0].snake.includes(newFood)
        ) {
            newFood = Math.floor(Math.random() * this.grid.length);
        }

        this.food = newFood;
    }

    nextFrame() {
        for (let player of this.players) {
            const head = player.snake[0] + player.direction;

            if (
                head < 0 ||
                head >= this.grid.length ||
                (player.direction === 1 && head % this.gridWidth === 0) ||
                (player.direction === -1 &&
                    head % this.gridWidth === this.gridWidth - 1) ||
                player.snake.includes(head)
            ) {
                this.finished = true;
                return;
            }

            player.snake = [head, ...player.snake];

            if (head === this.food) {
                this.getFood();
            } else {
                player.snake.pop();
            }
        }
    }

    getState(): string {
        // H = player 1 head
        // S = player 1 body
        // P = player 2 head
        // B = player 2 body
        // F = food
        // O = empty

        let result = "";
        for (let cell = 0; cell < this.grid.length; cell++) {
            if (cell === this.players[0].snake[0]) {
                result += "H";
            } else if (cell === this.players[1].snake[0]) {
                result += "P";
            } else if (this.players[0].snake.includes(cell)) {
                result += "S";
            } else if (this.players[1].snake.includes(cell)) {
                result += "B";
            } else if (cell === this.food) {
                result += "F";
            } else {
                result += "O";
            }
        }

        return result;
    }
}
