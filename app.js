var app = angular.module("app", ["ngRoute", "ngTouch"]);
var Deck = setGame.Deck;

app.config(["$routeProvider", function($routeProvider) {
  $routeProvider
    .when("/", {templateUrl:'start.html', controller: "StartController" })
    .when("/play/:seed", {templateUrl:'play.html', controller:"PlayController" });
}]);


app.controller("AppController", [AppController]);

function AppController($scope) {
}


app.controller("StartController", [ "$scope", "$location", StartController ]);

function StartController($scope, $location) {
  $scope.play = function() {
    $location.url("/play/" + (new Date().getTime()));
  };
}


app.controller("PlayController", [ "$scope", "$routeParams", "$timeout", PlayController ]);

function PlayController($scope, $routeParams, $timeout) {
  var seed = $routeParams.seed;

  var deck = new Deck(seed);
  var cards = deck.getCards();
  var sets = setGame.findSets(cards);
  var selectedCardIds = {};
  var selectedCount = 0;

  $scope.cards = cards;
  $scope.found = 0;
  $scope.total = sets.length;

  $scope.cardClicked = function(card) {
    if (selectedCardIds[card.id]) {
      delete selectedCardIds[card.id];
      selectedCount--;

    } else if (selectedCount < 2) {
      selectedCardIds[card.id] = true;
      selectedCount++;

    } else if (selectedCount === 2) {
      selectedCardIds[card.id] = true;
      var selectedCards = cards.filter(function(c) { return selectedCardIds[c.id]; });

      $timeout(function() {
        if (setGame.isSet(selectedCards)) {

          var selectedIds = Object.keys(selectedCardIds).sort();
          var set = sets.filter(function(x) {
            var ids = x.map(function(card) { return card.id; }).sort();
            return ids.every(function(id, index) { return id === selectedIds[index]; });
          })[0];
          if (set.found) {
            alert("Already found that set");
          } else {
            set.found = true;
            $scope.found++;
            if ($scope.found === $scope.total) {
              alert("You found all the sets!");
            } else {
              alert("SET!");
            }
          }
        } else {
          alert("Not a set :(");
        }

        // Clear selection
        selectedCardIds = {};
        selectedCount = 0;
      }, 100);
    }
  };

  $scope.isCardSelected = function(card) {
    return !!selectedCardIds[card.id];
  };
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

app.directive("ngTouch", function() {
  return {
    link: function(scope, element, attrs) {
      var eventName = ("ontouchstart" in document.documentElement) ? "touchstart" : "click";

      element.on(eventName, trigger);
      
      scope.$on("$destroy", function() { element.off(eventName, trigger); });

      function trigger() {
        scope.$apply(attrs.ngTouch);
      };
    }
  };
});
