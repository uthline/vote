'use strict';

var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Vote = mongoose.model('Vote'),
  Product = mongoose.model('Product'),
  _ = require('lodash');


/**
 * Create a Vote
 */

var io;

exports.socket = function(socket) {
  io = socket;
};

exports.create = function(req, res) {


  var vote = new Vote(req.body);
  vote.user = req.user;

  vote.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vote);
    }
  });

  console.log('here');
  Product.findById(req.body.product, function(err, product) {
    console.log('FOUND PRODUCT', product);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    if (req.body.positive)
      product.voteCount.up++;
    else
      product.voteCount.down++;

    console.log('product after addition', product);
    product.save(function(err) {
      console.log('error', err);
      if (err) {
        return err;
      }
      console.log('emit', product._id);
      io.emit(product._id, product.voteCount);
    });

  });

};

/**
 * List of Votes
 */
exports.list = function(req, res) {
  Vote.find().sort('-created').populate('user', 'displayName').exec(function(err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(products);
    }
  });
};