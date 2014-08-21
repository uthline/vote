'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
  products = require('../../app/controllers/products');

module.exports = function(app) {
  app.route('/products')
    .get(products.list)
    .post(users.requiresLogin, products.create);

  app.route('/products/:productId')
    .get(products.read)
    .put(users.requiresLogin, products.update);
//    .delete(users.requiresLogin, products.hasAuthorization, products.delete);

  // Finish by binding the article middleware
  app.param('productId', products.productByID);
};