import { ServerPlayer } from "./app";

class Player {
    snake: number[] = [];
}

export class Game {
    gridHeight: number = 10;
    gridWidth: number = 10;
    grid: number[] = [];

    players: Player[] = [];

    food: number = 0;

    constructor(height: number, width: number, players: ServerPlayer[]) {
        this.gridHeight = height;
        this.gridWidth = width;
        this.grid = Array(height * width).fill(null);

        this.players = players.map(() => new Player());
    }

    start(): void {
        if (this.players.length != 2) {
            console.error("Game needs 2 players to start");
            return;
        }

        this.players[0].snake = [2, 1, 0];
        this.players[1].snake = [97, 98, 99];

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
