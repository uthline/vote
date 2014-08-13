'use strict';

var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Product = mongoose.model('Product'),
  _ = require('lodash');


exports.create = function(req, res) {
  var product = new Product(req.body);
  product.user = req.user;


};