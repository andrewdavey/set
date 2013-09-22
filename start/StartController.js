app.controller("StartController", ["$scope", function($scope) {

  $scope.startGame = function() {
    $scope.$emit("newGame");
  };

}]);
