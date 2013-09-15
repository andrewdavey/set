var app = angular.module("app", ["ngTouch"]);

app.controller("GameController", [ "$scope", "$timeout", GameController ]);

function GameController($scope, $timeout) {
  var deck = new setGame.Deck();
  var selectedCards = [];

  var table = $scope.table = new setGame.Table(deck);

  $scope.totalSets = table.findSets().length;
  $scope.found = 0;

  $scope.cardClicked = function(card) {
    if (isCardSelected(card)) {
      deselectCard(card);
    } else if (selectedCards.length < 2) {
      selectCard(card);
    } else if (selectedCards.length === 2) {
      selectCard(card);
      if (setGame.isSet(selectedCards)) {
        $scope.found++;
      } else {
        invalidSet();
      }
      deselectAllCards();
    }
  };
  
  $scope.isCardSelected = isCardSelected;

  function isCardSelected (card) {
    return selectedCards.indexOf(card) >= 0;
  };

  function selectCard(card) {
    selectedCards.push(card);
  }

  function deselectCard(card) {
    var index = selectedCards.indexOf(card);
    if (index >= 0) selectedCards.splice(index, 1);
  }

  function deselectAllCards() {
    selectedCards = [];
  }

  function invalidSet() {
    $scope.invalidSet = true;
    $timeout(function() { $scope.invalidSet = false; }, 500);
  }
}


app.directive("svgContent", function() {
  return {
    link: function($scope, element, attributes) {
      $scope.$watch(attributes.svgContent, function(content) {
        element[0].appendChild(content);
      });
    }
  };
});

/*
var cards = [];
var deck = new setGame.Deck();
var a = deck.drawCard();
var b = deck.drawCard();
var c = deck.drawCardThatCompletesSet(a,b);
*/
