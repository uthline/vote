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

  Product.findById(req.body.product, function(err, product) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    if (req.body.positive)
      product.voteCount.up++;
    else
      product.voteCount.down++;

    product.save(function(err) {
      if (err) {
        return err;
      }
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