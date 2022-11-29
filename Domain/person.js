import {ValueCountStatus} from "./value_count_status.js";

export class Person {
  constructor() {
    this.hands = [];
    this.value = 0;
  }

  hit(deck) {
    this.hands.push(deck.hit());
  }

  stand() {
    // pass
  }

  calculateValue() {
    let value = 0;
    let count_ace = 0;
    for (let card of this.hands) {
      if (card.rank === "Ace") {
        value += card.value[1];
        count_ace += 1;
      } else {
        value += card.value;
      }
    }
    while (value > 21 && count_ace > 0) {
      value -= 10;
      count_ace -= 1;
    }
    return value;
  }


  getHandsInfo() {
    let hands_info = [];
    for (const card of this.hands) {
      hands_info.push(card.cardtoString());
    }
    // return hands_info.join(", ");
    return hands_info;
  }
}

export class Dealer extends Person {
  constructor() {
    super();
  }

  calculateFirstTurnValue() {
    if (this.hands[0].rank === 'Ace') {
      return this.hands[0].value[1];
    } else {
      return this.hands[0].value;
    }
  }
}

export class Player extends Person {
  bet = null;
  balance = 2500;
  name = null;

  constructor(name) {
    super();
    this.name = name;
  }

  setBet(bet) {
    this.bet = bet;
  }

  getValueCountStatus() {
    let value = this.calculateValue();
    if (value > 21) {
      return ValueCountStatus.BUST;
    } else if (value === 21) {
      return ValueCountStatus.BLACKJACK;
    } else {
      return ValueCountStatus.NORMAL;
    }
  }

  getFirstTurnValue() {
    if (this.hands[0].rank === 'Ace') {
      return 11;
    }
    return this.calculateValue()
  }
}
