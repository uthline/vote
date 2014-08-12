'use strict';

/**
 * Module dependencies.
 */
var aws = require('../../app/controllers/aws');

module.exports = function(app) {
  // AWS Routes
  app.route('/api/s3Policy').get(aws.getS3Policy);
};