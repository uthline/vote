'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: '',
    trim: true
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
  brand: {
    type: String,
    default: '',
    trim: true
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  category: {
    type: String,
    default: '',
    trim: true
  },
  link: {
    type: String,
    default: '',
    trim: true
  },
  votes: [{ type: Schema.ObjectId, ref: 'Vote' }],
  voteCount: {
    up: {
      type: Number,
      min: 0,
      default: 0
    },
    down: {
      type: Number,
      min: 0,
      default: 0
    }
  }
});

mongoose.model('Product', ProductSchema);