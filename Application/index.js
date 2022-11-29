import {BlackJackGame} from "../Domain/black_jack_game.js";
import {DataManager} from "../Persistance/data_manager.js";
import express from "express";
import {GameProcess} from "../Domain/game_process.js";
import {BetStatus} from "../Domain/bet_status.js";
import {ResBodySplicer} from "../Domain/res_body_splicer.js";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
const port = 3001;
app.use(bodyParser.json());

let gameInfo = new Map();

var SingletonDataManager = (function () {
    var dataManager;

    function createInstance() {
        dataManager = new DataManager();
        return dataManager;
    }

    return {
        getDataManager: function () {
            if (!dataManager) {
                dataManager = createInstance();
            }
            return dataManager;
        }
    }
})();

let currentGameStatus = null;
let gameStatuses = ['Start', 'PlayerTurn', 'DealerTurn', 'Over'];

let splicer = new ResBodySplicer();

// Start a new game
app.get("/game/start", async (req, res) => {
    // Get the parameters from the request
    let name = req.query.name;

    // Create a new game
    let game = new BlackJackGame(name);

    // Create a timestamp as game identity
    let gameID = Date.now();

    // Save the game to the map, we can use the gameID as key
    gameInfo.set(gameID, game);

    let dataManager = SingletonDataManager.getDataManager(name);
    game.player.balance = await dataManager.getBalanceFromDB(game.player.name, gameID);
    console.log(game.player.balance);
    console.log(dataManager.getBalance());
    console.log(`${name}'s balance is ${game.player.balance}.`);

    res.json(splicer.reqSuccess({
        'player_name': name, 'game_identity': gameID, 'game_process': GameProcess.START_NEW, 'balance': game.player.balance
    }));
    currentGameStatus = gameStatuses[0];
});

// Get bet
app.post("/game/set_bet", (req, res) => {
    let body = req.body
    console.log(body);
    let bet = body.bet;
    let gameID = body.game_identity;
    let game = gameInfo.get(gameID);

    if (!gameInfo.has(gameID)) {
        res.json(splicer.reqFail({
            'game_identity': gameID,
            'game_process': GameProcess.NO_GAME
        }, 'No game'));
    } else {
        let game = gameInfo.get(gameID);

        if (isNaN(bet)) {
            res.json(splicer.reqFail({
                'game_identity': gameID,
                'bet_status': BetStatus.INVALID_TYPE
            }, 'Invalid bet type'));
        }

        if (!game.setBet(bet)) {
            res.json(splicer.reqFail({
                'game_identity': gameID,
                'bet_status': BetStatus.INVALID_AMOUNT
            }, 'Invalid bet amount'));
        } else {
            game.bet = bet;
        }
    }

    res.json(splicer.reqSuccess({
        'player_name': body.name,
        'game_identity': body.game_identity,
        'bet': body.bet,
        'balance': game.getBalance()
    }));
});

// Deal cards
app.post("/game/deal", (req, res) => {
    let body = req.body;
    console.log(body);
    let gameID = body.game_identity;
    let game = gameInfo.get(gameID);
    let name = body.name;

    // Determine player's balance equals to 0 or not
    // If not, start a new game
    if (game.determineBalance()) {
        game.start();
    } else {
        res.json(splicer.reqFail({
            'game_identity': gameID,
            'game_process': GameProcess.NO_MONEY
        }, 'No enough balance'));
    }
    if (game.determineBlackJack()) {
        res.json(splicer.reqSuccess({
            'player_name': name,
            'game_identity': gameID,
            'player_hands': game.getPlayerHands(),
            'player_value': game.player.calculateValue(),
            'value_count_status': game.player.getValueCountStatus(),
            'dealer_hands': game.getDealerHands(),
            'dealer_value': game.dealer.calculateValue(),
            'game_result': game.getResult()
        }));
    }

    res.json(splicer.reqSuccess({
        'player_name': name,
        'game_identity': gameID,
        'player_hands': game.getPlayerHands(),
        'dealer_hands': game.getDealerHands(),
        'player_value': game.player.calculateValue(),
        'dealer_value': game.dealer.calculateFirstTurnValue(),
        'value_count_status': game.player.getValueCountStatus(),
    }));
    currentGameStatus = gameStatuses[1];
});

// Hit
app.post("/game/hit", (req, res) => {
    console.log(req.body);
    let gameID = req.body.game_identity;
    let game = gameInfo.get(gameID);
    let name = req.body.name;

    let playerHit = game.playerTryHit();
    console.log(playerHit);
    if (playerHit[0]) {
        game.playerTurn('hit');
        res.json(splicer.reqSuccess({
            'player_name': name,
            'game_identity': gameID,
            'player_hands': game.getPlayerHands(),
            'player_value': game.player.calculateValue(),
            'value_count_status': game.player.getValueCountStatus()
        }));
        currentGameStatus = gameStatuses[2];
    } else {
        res.json(splicer.reqFail({
            'game_identity': gameID
        }, playerHit[1]));
    }
});

// Stand and response game result
app.post("/game/stand", (req, res) => {
    let gameID = req.body.game_identity;
    let game = gameInfo.get(gameID);
    let name = req.body.name;

    game.playerTurn('stand');
    game.dealerTurn();
    res.json(splicer.reqSuccess({
        'player_name': name,
        'game_identity': gameID,
        'player_hands': game.getPlayerHands(),
        'player_value': game.player.calculateValue(),
        'value_count_status': game.player.getValueCountStatus(),
        'dealer_hands': game.getDealerHands(),
        'dealer_value': game.dealer.calculateValue(),
        'game_result': game.getResult(),
        'bet': game.bet,
        'balance': game.getBalance()
    }));



    currentGameStatus = gameStatuses[3];
});

app.post("/game/game_over", async (req, res) => {
    let gameID = req.body.game_identity;
    let game = gameInfo.get(gameID);
    let name = req.body.name;

    if (currentGameStatus === 'Over') {
        res.json(splicer.reqSuccess({
            'player_name': name,
            'game_identity': gameID,
            'game_process': GameProcess.GAME_OVER,
            'balance': game.getBalance(),
        }));
    }
    console.log(`Your balance is ${game.getBalance()}`);

    let dataManager = SingletonDataManager.getDataManager();
    // dataManager.setBalance(game.getBalance());
    await dataManager.setBalanceToDB(game.player.name, gameID, game.player.balance);
    console.log(`Your current balance is ${game.getBalance()}.`);

    console.log("Game over! Bye!");
    currentGameStatus = gameStatuses[4];
    game.turn = 0;
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

