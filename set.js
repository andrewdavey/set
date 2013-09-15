var setGame = (function() {

  // A set card
  var Card = function(color, shading, symbol, number) {
    this.color = color;
    this.shading = shading;
    this.symbol = symbol;
    this.number = number;
    this.id = [color, shading, symbol, number].join("");
    this.svg = this.toSVG();
  };

  Card.prototype.toString = function() {
    return this.id;
  };

  Card.svgSymbols = {
    0: "M150-0.047L0,300l150,300l150-300.024L150-0.047L150-0.047z",
    1: "M150,0C67.5,0,0,67.5,0,150v300c0,82.5,67.5,150,150,150s150-67.5,150-150V150C300,67.5,232.5,0,150,0L150,0z",
    2: "M108,0C72,0,0,0,0,72s95.059,82.23,72,146C46.688,288,0,310,0,455s155,145,192,145s108-2,108-73s-88.177-90.905-71.661-165.027C244.605,288.973,300,288,300,144S144,0,108,0L108,0z"
  };
  Card.svgShading = {
    0: "M118,67h63 M100,112h100 M78,157h144 M59,202h185 M37,247h230 M17,293h266 M33,338h234 M55,383h185 M80,428h144 M104,473h94 M118,518h63",
    1: "M40,53h221 M14,106h270 M4,160h290 M4,213h290 M4,266h290 M4,319h290 M4,372h290 M4,425h290 M4,479h290 M14,479h270 M30,531h241",
    2: "M10,53h260 M14,106h280 M50,160h240 M65,213h230 M45,266h240 M20,319h230 M4,372h230 M4,425h240 M4,479h275 M15,531h280"
  };

  Card.colors = [
    "#ff0000",
    "#008800",
    "#000088"
  ];

  Card.prototype.toSVG = function() {
    var svgNS = "http://www.w3.org/2000/svg";
    var group = document.createElementNS(svgNS, "g");

    var back = document.createElementNS(svgNS, "rect");
    back.setAttribute("x", 0);

    var xOffset;
    switch (this.number) {
      case 0: xOffset = 380; break;
      case 1: xOffset = 200; break;
      case 2: xOffset = 30; break;
    }

    for (var i = 0; i <= this.number; i++) {
      var path = document.createElementNS(svgNS, "path");
      
      path.setAttribute("stroke-width", "20");
      path.setAttribute("stroke", Card.colors[this.color]);
      
      if (this.shading === 2) {
        path.setAttribute("fill", Card.colors[this.color]);
      } else {
        path.setAttribute("fill", "transparent");
      }

      var pathData = Card.svgSymbols[this.symbol];
      if (this.shading === 1) {
        pathData += Card.svgShading[this.symbol];
      }
      path.setAttribute("d", pathData);

      path.setAttribute("transform", "translate(" + (i * 340 + xOffset) + ",50)");

      group.appendChild(path);
    }
    return group;
  };

  // A deck of set cards
  var Deck = function(randomSeed) {
    Math.seedrandom(randomSeed);
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

  Deck.prototype.getCards = function() {
    var selectedIds = {};
    var selectedCards = [];

    function select(card) {
      selectedCards.unshift(card);
      selectedIds[card.id] = true;
    }

    select(this.drawCard());
    select(this.drawCard());

    while (selectedCards.length < 12) {
      var card1 = selectedCards[0];
      var card2 = selectedCards[1];

      var card3Id = this.cardIdThatCompletesSet(card1, card2);
      if (!selectedIds[card3Id]) {
        var card3 = this.cards.filter(function(c) { return c.id === card3Id; })[0];
        this.cards.splice(this.cards.indexOf(card3), 1);
        select(card3);
      }
      select(this.drawCard());
    }
    return selectedCards.slice(0, 12);
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

  Deck.prototype.find = function(cardId) {
    return this.cards.filter(function(card) { return card.id === cardId; })[0];
  };

  Deck.prototype.cardIdThatCompletesSet = function(card1, card2) {
    var getters = [getColor, getShading, getSymbol, getNumber];
    var values1 = getters.map(function(get) { return get(card1); });
    var values2 = getters.map(function(get) { return get(card2); });
    var values3 = [];
    for (var i = 0; i < 4; i++) {
      var value1 = values1[i], value2 = values2[i];
      if (value1 === value2) {
        values3[i] = value1;
      } else if ((value1 === 0 && value2 === 1) || (value1 === 1 && value2 === 0)){
        values3[i] = 2;
      } else if ((value1 === 0 && value2 === 2) || (value1 === 2 && value2 === 0)){
        values3[i] = 1;
      } else {
        values3[i] = 0;
      }
    }
    var cardId = values3.join("");
    return cardId;
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
    return findSets(this.drawnCards);
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

  function findSets(cards) {
    var sets = [];
    cards.forEach(function(a, aIndex) {
      cards.slice(aIndex+1).forEach(function(b, bIndex) {
        cards.slice(aIndex + bIndex + 1).forEach(function(c) {
          if (isSet([a,b,c])) sets.push([a,b,c]);
        });
      });
    });
    return sets;
  }

  return {
    Table: Table,
    Deck: Deck,
    Card: Card,
    isSet: isSet,
    findSets: findSets
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
      if (array[i-1] !== array[i]) return false;
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

