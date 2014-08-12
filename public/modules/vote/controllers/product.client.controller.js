'use strict';

angular.module('vote').controller('productController', ['$scope', '$stateParams', '$location', 'Authentication',
  function($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;



    var socket = io();
    console.log('socket', socket);
  }
]);