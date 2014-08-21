'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
  vote = require('../../app/controllers/vote');

module.exports = function(app) {
  app.route('/vote')
    .get(vote.list)
    .post(users.requiresLogin, vote.create);

  app.route('/vote/:voteId')
    .delete(users.requiresLogin, vote.delete);

  // Finish by binding the vote middleware
  app.param('voteId', vote.voteById);
};