angular.module('vote').directive('product', ['Vote', function(Vote) {
  return {
    restrict: 'E',
    scope: {
      model: '='
    },
    link: function(scope) {
      scope.updateVote = function(increase) {
        var vote = new Vote({
          positive: increase,
          product: scope.model._id
        });
        vote.$save(function(response) {
          console.log('saved response', response);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };
      var socket = io();
      socket.on(scope.model._id, function(msg){
        console.log('MESSAGE', msg);
        scope.model.voteCount = msg;
        console.log(scope.model);
        scope.$apply();
      });
    },
    template: '<img ng-src="{{model.image}}"/> ' +
      '<div class="info">' +
        '<span>{{model.macros.fat}}</span>' +
        '<span>{{model.macros.protein}}</span>' +
        '<span>{{model.macros.carbs}}</span>' +
      '</div>' +
      '<div class="vote-btns">' +
        '<span ng-click="updateVote(true)" class="glyphicon glyphicon-thumbs-up"></span>{{model.voteCount.up}}' +
        '<span ng-click="updateVote(false)" class="glyphicon glyphicon-thumbs-down"></span>{{model.voteCount.down}}' +
      '</div>'
  }
}]);