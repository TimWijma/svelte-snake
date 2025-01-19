import { get, writable } from "svelte/store";
import { Player } from "./Player";

export class Game {
    width: number = 10;
    height: number = 10;
    private gridStore = writable<string[]>([]);
    players: Player[] = [];
    direction: number = 1;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.gridStore.set(new Array(this.width * this.height).fill("O"));
    }

    get grid() {
        return get(this.gridStore);
    }

    set grid(value: string[]) {
        this.gridStore.set(value);
    }

    setState(grid: string) {
        // this.grid = [...grid.split("")];
        const newGrid = grid.split("");
        this.gridStore.set(newGrid);
    }
}
