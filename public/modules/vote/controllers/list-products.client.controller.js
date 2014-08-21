'use strict';

angular.module('vote').controller('listProductsController', ['$scope', '$stateParams', '$location', 'Products', 'Authentication',
  function($scope, $stateParams, $location, Products, Authentication) {

    $scope.user = Authentication.user;
    $scope.products = [];

    $scope.initProducts = function() {
      $scope.products = Products.query(function(response) {
        $scope.products = response;
        console.log($scope.products);
      });
    }

  }
]);