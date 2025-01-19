import { Player } from "./Player";

export class Game {
    width: number = 10;
    height: number = 10;
    grid: string[] = [];
    players: Player[] = [];
    direction: number = 1;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.grid = new Array(this.width * this.height).fill("O");
    }

    setState(grid: string) {
        this.grid = [...grid.split("")];
    }
}
