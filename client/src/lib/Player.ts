export class Player {
    snake: number[];
    constructor(public name: string, public playerNumber: number) {
        if (playerNumber === 1) {
            this.snake = [2, 1, 0];
        } else {
            this.snake = [98, 99, 100];
        }
    }
}

export class ClientPlayer {
    constructor(public name: string, public playerNumber: number) {}
}
