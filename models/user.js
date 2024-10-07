var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var users = new Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  passward: {
    type: String,
    required: true
  },
  birthDay: {
    type: Date,
    required: true
  },
  gander: {
    type: String,
    required: true
  },
  address: {
    street1: {
      type: String,
      required: true
    },
    street2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    required: true
  },
  phone: [{
    type: String,
    required: true
  }],
  images: [{
    type: String
  }],
  favourites: [{
    productId: {
      type: Schema.Types.ObjectId
    }
  }],
  latestOrderId: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  lastLogin: {
    type: Date,
    required: true
  }
});

module.exports= mongoose.model('User', users);