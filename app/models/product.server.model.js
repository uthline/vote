'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  macros: {
    fat: {
      type: Number,
      min: 0,
      max: 1000
    },
    protein: {
      type: Number,
      min: 0,
      max: 1000
    },
    carbs: {
      type: Number,
      min: 0,
      max: 1000
    }
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Product', ProductSchema);