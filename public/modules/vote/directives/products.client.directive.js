'use strict';

angular.module('vote').directive('product', ['Vote', '_', function(Vote, _) {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      user: '='
    },
    link: function(scope) {

      scope.vote = '';
      scope.found = false;
      scope.loadVotes = function() {
        Vote.query({user: scope.user._id}, function(votes) {
          _.some(votes, function(vote) {
            if ((vote.product === scope.model._id) && (vote.user._id === scope.user._id)) {
              scope.found = vote;
              return true;
            }
          });
          if ( scope.found ) {
            // Vote already exists for this product by this user
            if (scope.found.positive) {
              scope.vote = 'up';
            } else {
              scope.vote = 'down';
            }
          }
        });
      }

      scope.createVote = function(increase) {
        var newVote = new Vote({
          positive: increase,
          product: scope.model._id
        });
        newVote.$save(function(response) {
        }, function(errorResponse) {
          scope.error = errorResponse.data.message;
        });
      };

      scope.updateVote = function(increase) {
        if (scope.vote) {
          scope.found.$delete({}, function(vote) {
            if (scope.found && (increase != scope.found.positive)) {
              scope.createVote(increase);
              scope.vote = '';
              scope.found = false;
              scope.loadVotes();
            }
          });
        } else {
          scope.createVote(increase);
          scope.loadVotes();
        }
      };

      scope.loadVotes();
      var socket = io();
      socket.on(scope.model._id, function(msg){
        scope.model.voteCount = msg;
        scope.$apply();
      });
    },
    replace: true,
    template: '<div class="product">' +
        '<img ng-src="{{model.image}}"/> ' +
        '<div class="info">' +
          '<span>{{model.macros.fat}}</span>' +
          '<span>{{model.macros.protein}}</span>' +
          '<span>{{model.macros.carbs}}</span>' +
        '</div>' +
        '<div class="vote-btns {{vote}}">' +
          '<span ng-click="updateVote(true)" class="glyphicon glyphicon-thumbs-up"></span>{{model.voteCount.up}}' +
          '<span ng-click="updateVote(false)" class="glyphicon glyphicon-thumbs-down"></span>{{model.voteCount.down}}' +
        '</div>' +
      '</div>'
  }
}]);