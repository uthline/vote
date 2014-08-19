'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var VoteSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  product: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  positive: {
    type: Boolean,
    default: true,
    required: 'Must enter vote'
  }
});

mongoose.model('Vote', VoteSchema);