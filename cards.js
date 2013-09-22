(function() {

  app.value("set", {
    createDeck: createDeck,
    isSet: isSet,
    findSets: findSets
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
