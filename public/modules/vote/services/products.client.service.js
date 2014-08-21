'use strict';

// Products service used for communicating with the products REST endpoints
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


// Votes service used for communicating with the vote REST endpoints
angular.module('vote').factory('Vote', ['$resource',
  function($resource) {
    return $resource('vote/:voteId', {
      voteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);