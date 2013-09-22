app.controller("PlayController", ["$scope", "$routeParams", "$timeout", "set", function($scope, $routeParams, $timeout, set) {

  Math.seedrandom($routeParams.game);
  
  var deck = set.createDeck().shuffle();
  var cards = deck.slice(0, 12);
  var sets = set.findSets(cards);
  var found = {};

  $scope.cards = cards;
  $scope.found = 0;
  $scope.total = sets.length;
  $scope.invalidSet = false;

  $scope.$watch("cards", function(cards) {
    var selectedCards = getSelectedCards();
    if (selectedCards.length < 3) {
      return;

    } else if (set.isSet(selectedCards)) {
      if (foundNewSet(selectedCards)) {
        var count = ++$scope.found;
        if (count === sets.length) {
          $scope.$emit("wonGame");
        }
      } else {
        // flash message?
      }
      deselectAllCards();

    } else {
      $scope.invalidSet = true;
      $timeout(function() {
        deselectAllCards();
        $scope.invalidSet = false;
      }, 500);
    }
  }, true);

  function getSelectedCards() {
    return cards.filter(function(c) { return c.selected; });
  }

  function deselectAllCards() {
    cards.forEach(function(card) {
      card.selected = false;
    });
  }

  function foundNewSet(cards) {
    cards.sort(function(a,b) { return a.id - b.id; });
    var id = cards.map(function(c) { return c.id; }).join(";");
    if (id in found) {
      return false;
    } else {
      found[id] = true;
      return true;
    }
  }

}]);
