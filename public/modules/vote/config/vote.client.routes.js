'use strict';

// Setting up route
angular.module('vote').config(['$stateProvider',
  function($stateProvider) {
    // Articles state routing
    $stateProvider.
      state('submit', {
        url: '/submit',
        templateUrl: 'modules/vote/views/create-product.html'
      });
  }
]);