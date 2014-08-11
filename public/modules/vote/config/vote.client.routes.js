'use strict';

// Setting up route
angular.module('vote').config(['$stateProvider',
  function($stateProvider) {
    // Articles state routing
    $stateProvider.
      state('vote', {
        url: '/vote',
        templateUrl: 'modules/vote/views/create-product.html'
      });
  }
]);