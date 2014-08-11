'use strict';

angular.module('vote').controller('VoteController', ['$scope', '$stateParams', '$location', 'Authentication',
  function($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;



    var socket = io();
    console.log('socket', socket);
  }
]);