import {Dealer, Person, Player} from "./person.js";
import {Deck} from "./card.js";
import {ValueCountStatus} from "./value_count_status.js";
import {GameResult} from "./game_result.js";


export class BlackJackGame {
    constructor(name) {
        this.name = name;
        this.player = new Player(name);
        this.dealer = new Dealer();
        this.deck = new Deck();
        this.default_balance = 2500;
        this.turn = 0;
        this.answer = "y";
    }

    getTurn() {
        return this.turn;
    }

    calculateTurn() {
        this.turn += 1;
        return this.turn;
    }

    hit() {
        this.player.hit(this.deck);
    }

    stand() {
        this.player.stand();
    }

    start() {
        this.deck.shuffle();
        this.player.hands = this.deck.deal();
        this.dealer.hands = this.deck.deal();
        this.calculateTurn();
    }

    getBalance() {
        return this.player.balance;
    }

    setBet(bet) {
        if (bet > this.player.balance) {
            return false;
        } else {
            this.player.setBet(bet);
            return true;
        }
    }

    getDealerHands() {
        if (this.turn === 1) {
            let firstCard = this.dealer.hands[0];
            return ['card-back', firstCard.cardtoString()];
        } else {
            return this.dealer.getHandsInfo();
        }
    }

    getPlayerHands() {
        return this.player.getHandsInfo();
    }

    playerTurn(action) {
        if (action === "hit") {
            this.hit();
        }
        if (action === "stand") {
            this.stand();
        }
    }

    calculatePlayerValue() {
        return this.player.calculateValue();
    }

    calculateDealerValue() {
        return this.dealer.calculateValue();
    }

    dealerTurn() {
        if (this.calculateDealerValue() >= 17) {
            this.calculateTurn();
        }
        while (this.calculateDealerValue() < 17) {
            this.dealer.hit(this.deck);
            this.calculateTurn();
        }
    }

    handleWinBalance() {
        this.player.balance += this.player.bet;
    }

    handleLoseBalance() {
        this.player.balance -= this.player.bet;
    }

    getResult() {
        this.calculateTurn();
        let playerValue = this.calculatePlayerValue();
        let dealerValue = this.calculateDealerValue();
        if (playerValue > 21) {
            this.handleLoseBalance();
            return GameResult.DEALER_WINS;
        }
        if (playerValue === 21) {
            if (dealerValue === 21) {
                return GameResult.PUSH;
            } else {
                this.handleWinBalance();
                return GameResult.PLAYER_WINS;
            }
        } else {
            if (dealerValue > 21) {
                this.handleWinBalance();
                return GameResult.PLAYER_WINS;
            }
            if (playerValue > dealerValue) {
                this.handleWinBalance();
                return GameResult.PLAYER_WINS;
            }
            if (playerValue === dealerValue) {
                return GameResult.PUSH;
            } else {
                this.handleLoseBalance();
                if (dealerValue === 21) {
                    return GameResult.DEALER_WINS;
                } else {
                    return GameResult.DEALER_WINS;
                }
            }
        }
    }

    playAgain() {
        this.turn = 0;
    }

    determineBalance() {
        return this.player.balance !== 0;
    }

    playerTryHit() {
       if (this.player.getValueCountStatus() === ValueCountStatus.NORMAL) {
           return [true, "Hit successfully!"];
       } else {
           return [false, "The hands value is greater or equal to 21"];
       }
    }

    determineBlackJack () {
        if(this.player.getValueCountStatus() === ValueCountStatus.BLACKJACK) {
            return true;
        }
    }
}
