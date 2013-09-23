(function() {

  app.value("set", {
    createDeck: createDeck,
    isSet: isSet,
    findSets: findSets,
    generateGameCards: generateGameCards
  });

  function createDeck() {
    var values = [1,2,3];
    var deck = [];
    values.forEach(function(symbol) {
      values.forEach(function(number) {
        values.forEach(function(color) {
          values.forEach(function(shading) {
            deck.push({
              symbol: symbol,
              number: number,
              color: color,
              shading: shading,
              id: [symbol, number, color, shading].join("")
            });
          });
        });
      });
    });
    return deck;
  }

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
          var set = [a,b,c];
          set.sort(byId);
          if (isSet(set)) sets.push(set);
        });
      });
    });
    return sets;
  }

  function generateGameCards(deck) {
    var deck = createDeck().shuffle();
    var selected = [];

    function select(card) {
      selected.unshift(card);
    }

    select(deck.pop());
    select(deck.pop());

    while (selected.length < 12) {
      var card1 = selected[0];
      var card2 = selected[1];
      var card3 = findCardThatCompletesSet(card1, card2, deck);
      if (card3) {
        var index = deck.indexOf(card3);
        deck.splice(index, 1);
        select(card3);
      }
      select(deck.pop());
    }

    return selected.slice(0, 12).shuffle();
  }

  function findCardThatCompletesSet(card1, card2, deck) {
    var getters = [getSymbol, getNumber, getColor, getShading];
    var values1 = getters.map(function(get) { return get(card1); });
    var values2 = getters.map(function(get) { return get(card2); });
    var values3 = [];
    for (var i = 0; i < 4; i++) {
      var value1 = values1[i], value2 = values2[i];
      if (value1 === value2) {
        values3[i] = value1;
      } else if ((value1 === 1 && value2 === 2) || (value1 === 2 && value2 === 1)){
        values3[i] = 3;
      } else if ((value1 === 2 && value2 === 3) || (value1 === 3 && value2 === 2)){
        values3[i] = 1;
      } else {
        values3[i] = 2;
      }
    }
    var id = values3.join("");
    return deck.filter(function (card3) {
      return card3.id === id;
    })[0];
  }

  function byId(a, b) {
    return a.id - b.id;
  }

  function getColor(c) { return c.color; };
  function getShading(c) { return c.shading; };
  function getSymbol(c) { return c.symbol; };
  function getNumber(c) { return c.number; };

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
