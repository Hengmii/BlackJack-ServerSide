class Card {
  static suits = ["squares", "spade", "heart", "clubs"];
  static rank = [
    "Ace",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King",
  ];
  static value = {
    Ace: [1, 11],
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    Jack: 10,
    Queen: 10,
    King: 10,
  };

  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.value = Card.value[rank];
  }

  cardtoString() {
    return this.suit.concat(this.rank);
  }
}

export class Deck {
  deck = new Array();
  constructor() {
    for (const suit of Card.suits) {
      for (const rank of Card.rank) {
        this.deck.push(new Card(suit, rank));
      }
    }
  }

  shuffle() {
    let myDeck = new Deck();
    this.deck = myDeck.deck;
    for (let i = 0; i < this.deck.length; i++) {
      let j = Math.floor(Math.random() * this.deck.length);
      let temp = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = temp;
    }
  }

  deal() {
    let hands = [];
    while (hands.length < 2) {
      hands.push(this.deck.pop());
    }
    return hands;
  }

  hit() {
    return this.deck.pop();
  }
}
