var setGame = (function() {

  // A set card
  var Card = function(color, shading, symbol, number) {
    this.color = color;
    this.shading = shading;
    this.symbol = symbol;
    this.number = number;
  };

  Card.prototype.toString = function() {
    return [this.color, this.shading, this.symbol, this.number].join("");
  };

  // A deck of set cards
  var Deck = function() {
    this.createCards();
    this.shuffleCards();
  };

  Deck.prototype.createCards = function() {
    this.cards = [];
    // Each card has 4 properties: Color, Shading, Symbol, Number
    // Each property has 3 possible values
    for (var color = 0; color < 3; color++) {
      for (var shading = 0; shading < 3; shading++) {
        for (var symbol = 0; symbol < 3; symbol++) {
          for (var number = 0; number < 3; number++) {
            this.cards.push(new Card(color, shading, symbol, number));
          }
        }
      }
    }
  };

  Deck.prototype.shuffleCards = function() {
    shuffle(this.cards);
  };

  Deck.prototype.drawCard = function() {
    return this.cards.pop();
  };

  Deck.prototype.count = function() {
    return this.cards.length;
  };


  // The game table where cards are placed
  var Table = function(deck) {
    this.deck = deck;
    this.drawnCards = [];
    this.drawCards(12);
  };

  Table.prototype.drawCards = function(number) {
    while (number-- > 0) {
      var card = this.deck.drawCard();
      this.drawnCards.push(card);
    }
  };

  Table.prototype.foundSet = function(cards) {
    if (isSet(cards)) {
      this.removeCards(cards);
      if (this.deck.count() > 0) {
        this.drawCards(3);
      } else {
        // Game over
      }
      return true;
    } else {
      return false;
    }
  };

  Table.prototype.removeCards = function(cards) {
    cards.forEach(function(card) {
      var index = this.drawnCards.indexOf(card);
      this.drawnCards.splice(index, 1);
    }, this);
  };

  Table.prototype.findSets = function() {
    var cards = this.drawnCards;
    var sets = [];
    cards.forEach(function(a, aIndex) {
      cards.slice(aIndex+1).forEach(function(b, bIndex) {
        cards.slice(aIndex + bIndex + 1).forEach(function(c) {
          if (isSet([a,b,c])) sets.push([a,b,c]);
        });
      });
    });
    return sets;
  };


  function getColor(c) { return c.color; };
  function getShading(c) { return c.shading; };
  function getSymbol(c) { return c.symbol; };
  function getNumber(c) { return c.number; };

  function isSet(cards) {
    if (cards.length !== 3) return false;

    var allSameColor = allEqual(cards.map(getColor));
    var allDifferentColor = allDifferent(cards.map(getColor));

    var allSameShading = allEqual(cards.map(getShading));
    var allDifferentShading = allDifferent(cards.map(getShading));

    var allSameSymbol = allEqual(cards.map(getSymbol));
    var allDifferentSymbol = allDifferent(cards.map(getSymbol));

    var allSameNumber = allEqual(cards.map(getNumber));
    var allDifferentNumber = allDifferent(cards.map(getNumber));

    return (allSameColor || allDifferentColor) &&
           (allSameShading || allDifferentShading) &&
           (allSameSymbol || allDifferentSymbol) &&
           (allSameNumber || allDifferentNumber);
  }

  return {
    Table: Table,
    Deck: Deck,
    Card: Card,
    isSet: isSet
  };

  function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function allEqual(array) {
    for (var i = 1; i < array.length; i++) {
      if (array[i-1] !== array[1]) return false;
    }
    return true;
  }

  function allDifferent(array) {
    var seen = {};
    for (var i = 0; i < array.length; i++) {
      var value = array[i];
      if (seen[value]) return false;
      seen[value] = true;
    }
    return true;
  };

}());

