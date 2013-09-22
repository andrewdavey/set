app.controller("WonController", ["$scope", function($scope) {
  
  $scope.newGame = function() {
    $scope.$emit("newGame");
  };

}]);
