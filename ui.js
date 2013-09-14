var app = angular.module("app", ["ngTouch"]);

app.controller("GameController", [ "$scope", GameController ]);

function GameController($scope) {
  var deck = new setGame.Deck();
  var selectedCards = [];

  var table = $scope.table = new setGame.Table(deck);

  $scope.cardClicked = function(card) {
    if (isCardSelected(card)) {
      deselectCard(card);
    } else if (selectedCards.length < 2) {
      selectCard(card);
    } else if (selectedCards.length === 2) {
      selectCard(card);
      if (table.foundSet(selectedCards)) {

      } else {
        $scope.invalidSet = true;
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
}
