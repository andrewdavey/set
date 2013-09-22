app.directive("setCards", [ function() {

  var cardsPerRow = 4;
  var cardWidth = 60;
  var cardHeight = 38;
  var cardGap = 10;
  var colors = [ "red", "green", "blue" ];

  function createSvgElement(type, attrs) {
    var svgNS = "http://www.w3.org/2000/svg";
    var shape = document.createElementNS(svgNS, type);
    for (var key in attrs) {
      shape.setAttribute(key, attrs[key]);
    }
    return shape;
  }

  function renderCards(cards) {
    return cards.map(renderCard);
  }

  function renderCard(card, index) {
    var x = (index % cardsPerRow) * (cardGap + cardWidth) + cardGap;
    var y = Math.floor(index / cardsPerRow) * (cardGap + cardHeight) + cardGap;
    var rect = createSvgElement("rect", {
      x: x,
      y: y,
      width: cardWidth,
      height: cardHeight,
      rx: 5,
      rx: 5,
      fill: "white",
      stroke: "#222",
      "stroke-width": 0.5
    });
    var g = createSvgElement("g");
    g.appendChild(rect);

    var symbolWidth = cardWidth*2/10;
    var symbolHeight = cardHeight*8/10;
    var symbolY = y+cardHeight/2;
    switch (card.number) {
      case 1:
        g.appendChild(drawSymbol(x+cardWidth/2, symbolY, symbolWidth, symbolHeight, card));
        break;
      case 2:
        g.appendChild(drawSymbol(x+cardWidth * 15/40, symbolY, symbolWidth, symbolHeight, card));
        g.appendChild(drawSymbol(x+cardWidth * 25/40, symbolY, symbolWidth, symbolHeight, card));
        break;
      case 3:
        g.appendChild(drawSymbol(x+cardWidth * 5/20, symbolY, symbolWidth, symbolHeight, card));
        g.appendChild(drawSymbol(x+cardWidth * 10/20, symbolY, symbolWidth, symbolHeight, card));
        g.appendChild(drawSymbol(x+cardWidth * 15/20, symbolY, symbolWidth, symbolHeight, card));
        break;
    }
    return g;
  }

  function drawSymbol(x, y, width, height, card) {
    var d;
    switch (card.symbol) {
      case 1:
        d = drawDiamond(x, y, width, height);
        break;
      case 2:
        d = drawOval(x, y, width, height);
        break;
      case 3:
        d = drawSquiggle(x, y, width, height);
        break;
    }

    var color = colors[card.color - 1];
    var path = createSvgElement("path", {
      d: d,
      stroke: colors[card.color - 1],
      fill: card.shading === 3 ? color : 
            card.shading === 2 ? ("url(#shading-" + card.color + ")") :
            "transparent"
    });
    return path;
  }

  function drawDiamond(x, y, width, height, card) {
    var w = width / 2;
    var h = height / 2;
    return [
      "M", x, y,
      "m", 0, -h,
      "l", w, h,
      "l", -w, h,
      "l", -w, -h,
      "z"
    ].join(" ");
  }

  function drawOval(x, y, width, height, card) {
    var w = width / 2;
    var h = height / 2;
    return [
      "M", x, y,
      "m", -w, -h + 7.5,
      "c", 0, -10, width, -10, width, 0,
      "l", 0, height*5/10,
      "c", 0, 10, -width, 10, -width, 0,
      "z"
    ].join(" ");
  }

  function drawSquiggle(x, y, width, height) {
    var w = width / 2;
    var h = height / 2;
    return [
      "M", x, y,
      "m", -w, -h,
      "l", width, 0,
      "l", 0, height,
      "l", -width, 0,
      "z"
    ].join(" ");
  }

  function createPattern(color) {
    var pattern = createSvgElement("pattern", {
      id: "shading-" + color,
      patternUnits: "userSpaceOnUse",
      x: 0,
      y: 0.5,
      width: 10,
      height: 1.5
    });
    var path = createSvgElement("path", {
      d: "M0,0 l10,0",
      fill: "none",
      stroke: colors[color-1],
      "stroke-width": 1
    });
    pattern.appendChild(path);
    return pattern;
  }

  return {

    scope: {
      cards: "=setCards"
    },

    link: function(scope, element, attrs) {
      // cardElement is an array containing the card UI for each card.
      var cardElements;
      scope.$watch("cards", function(cards) {
        element.html("");

        var defs = createSvgElement("defs");
        defs.appendChild(createPattern(1));
        defs.appendChild(createPattern(2));
        defs.appendChild(createPattern(3));
        element.append(defs);

        var container = createSvgElement("g");
        cardElements = renderCards(cards, container);
        cardElements.forEach(function(element) {
          container.appendChild(element);
        });
        element.append(container);
      });

      scope.$watch("cards", function(cards) {
        cards.forEach(function(card, index) {
          if (card.selected) {
            cardElements[index].setAttribute("class", "selected");
          } else {
            cardElements[index].setAttribute("class", "");
          }
        });
      }, true);

      // React to touchstart if possible, otherwise react to mousedown.
      var eventName = "ontouchstart" in document.documentElement ? "touchstart" : "mousedown";
      element.on(eventName, toggleCardSelection);

      // Remove event handler when scope is destroyed
      scope.$on("$destroy", function() {
        element.off(eventName, toggleCardSelection);
      });

      function toggleCardSelection(event) {
        var cardElement = event.target || event.srcElement;
        while (cardElement && cardElement.nodeName.toLowerCase() !== "g") {
          cardElement = cardElement.parentNode;
        }
        if (!cardElement) return;

        event.preventDefault();

        scope.$apply(function() {
          var cardIndex = cardElements.indexOf(cardElement);
          var card = scope.cards[cardIndex];
          card.selected = !card.selected;
        });
      }
    }

  };

} ]);
