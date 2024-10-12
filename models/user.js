var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var users = new Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthDay: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: {
      street1: {
        type: String,
        required: true,
      },
      street2: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  phone: [
    {
      type: String,
      required: true,
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  favorites: [
    {
      productId: {
        type: Schema.Types.ObjectId,
      },
    },
  ],
  latestOrderId: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", users);
