'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Product = mongoose.model('Product'),
  _ = require('lodash');

/**
 * Create a product
 */
exports.create = function(req, res) {
  var product = new Product(req.body);

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Show the current product
 */
exports.read = function(req, res) {
  res.jsonp(req.product);
};

/**
 * Update a Product
 */
exports.update = function(req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Delete a product
 */
exports.delete = function(req, res) {
  var product = req.product;

  product.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function(req, res) {
  Product.find().sort('-created').exec(function(err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(products);
    }
  });
};

/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) {
  Product.findById(id).exec(function(err, product) {
    if (err) return next(err);
    if (!product) return next(new Error('Failed to load article ' + id));
    req.product = product;
    next();
  });
};