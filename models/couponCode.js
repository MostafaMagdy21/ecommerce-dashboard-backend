var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var couponCode = new Schema({

  couponCodeName: {
    type: String,
    required: true
},

  discount: {
    type: String,
    required: true
  },

  discountStatus: {
    type: String,
    required: true
  },

  originalPrice: {
    type: Number,
    required: true
  },

  finalPrice: {
    type: Number,
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  createdAt: {
    type: Date,
    required: true
  },

  updatedAt: {
    type: Date,
    required: true
  }
});


module.exports = mongoose.model('CouponCode', couponCode);