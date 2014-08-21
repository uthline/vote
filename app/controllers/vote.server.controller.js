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
      console.log('product created');
      io.emit(product._id, product.voteCount);
    });

  });

};

/**
 * Delete a vote
 */
exports.delete = function(req, res) {
  var vote = req.vote;

  vote.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Product.findById(vote.product, function(err, product) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }

        if (vote.positive)
          product.voteCount.up--;
        else
          product.voteCount.down--;

        product.save(function(err) {
          if (err) {
            return err;
          }
          console.log('product created');
          io.emit(product._id, product.voteCount);
        });
      });
      res.jsonp(vote);
    }
  });
};


/**
 * List of Votes
 */
exports.list = function(req, res) {
  Vote.find().sort('-created').populate('user', 'displayName').exec(function(err, votes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(votes);
    }
  });
};

/**
 * Vote middleware
 */
exports.voteById = function(req, res, next, id) {
  Vote.findById(id).exec(function(err, vote) {
    if (err) return next(err);
    if (!vote) return next(new Error('Failed to load vote ' + id));
    req.vote = vote;
    next();
  });
};