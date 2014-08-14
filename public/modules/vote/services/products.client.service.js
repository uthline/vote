'use strict';

//Products service used for communicating with the articles REST endpoints
angular.module('vote').factory('Products', ['$resource',
  function($resource) {
    return $resource('products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);