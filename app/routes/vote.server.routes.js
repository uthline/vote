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
};