var app = angular.module("app", ["ngRoute"]);


app.config(["$routeProvider", function($routeProvider) {

  $routeProvider
    .when("/", {
      controller: "StartController",
      templateUrl: "start/start.html"
    })
    .when("/play/:game", {
      controller: "PlayController",
      templateUrl: "play/play.html"
    })
    .when("/won", {
      controller: "WonController",
      templateUrl: "won/won.html"
    });

}]);


app.controller("AppController", [ "$scope", "$location", function($scope, $location) {

  $scope.$on("newGame", startNewGame);
  $scope.$on("wonGame", wonGame);

  function startNewGame() {
    var game = new Date().getTime();
    $location.url("play/" + game);
  }

  function wonGame() {
    $location.url("won");
  }

}]);
