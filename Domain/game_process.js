export class GameProcess {
    static get START_NEW() {
        return 0;
    }

    static get RESUME() {
        return 1;
    }

    static get NO_MONEY() {
        return 2;
    }

    static get GAME_OVER() {
        return 3;
    }

    static get NO_GAME() {
        return 404;
    }
}
