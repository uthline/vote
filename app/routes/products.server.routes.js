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
};