'use strict';

angular.module('vote').controller('listProductsController', ['$scope', '$stateParams', '$location', 'Products', 'Vote',
  function($scope, $stateParams, $location, Products, Vote) {

    $scope.products = [];

    $scope.initProducts = function() {
      $scope.products = Products.query(function(response) {
        $scope.products = response;
        console.log($scope.products);
      });
    }



  }
]);