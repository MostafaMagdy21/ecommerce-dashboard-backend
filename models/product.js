// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var products = new Schema({
//   sku: {
//     type: String,
//     required: true
//    },
//   title: {
//     type: String,
//     required: true
//   },
//   price: {
//     base: {
//       type: String,
//       required: true
//     },
//     discount: {
//       type: String
//     },
//     required: true
//   },
//   description: {
//     type: String
//   },
//   images: [{
//     type: String,
//     required: true
//   }],
//   // categoryId: {
//   //   type: Schema.Types.ObjectId,
//   //   required: true
//   // },
//   quantity: {
//     type: Number,
//     required: true
//   },
//   options: {
//     vitamens: [{
//       type: String
//     }],
//     size: [{
//       type: String
//     }],
//     scent: [{
//       type: String
//     }],
//     gender: [{
//       type: String
//     }]
//   },
//   tags: [{
//     type: String
//   }],
//   rating: {
//     type: Number
//   },
//   status: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     required: true
//   },
//   updatedAt: {
//     type: Date,
//     required: true
//   },
//   // createdBy: {
//   //   type: Schema.Types.ObjectId,
//   //   required: true
//   // }

// });

// module.exports = mongoose.model('Product', products)


















var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var products = new Schema({
  sku: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    base: {
      type: String,
      required: true 
    },
    discount: {
      type: String
    }
  },
  description: {
    type: String
  },
  images: [{
    type: String,
    required: true
  }],
  categoryId: {
    type: Schema.Types.ObjectId,
    required: false
  },
  quantity: {
    type: Number,
    required: true
  },
  options: {
    vitamins: [{
      type: String
    }],
    size: [{
      type: String
    }],
    scent: [{
      type: String
    }],
    gender: [{
      type: String
    }]
  },
  tags: [{
    type: String
  }],
  rating: {
    type: Number
  },
  status: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
  default: Date.now,
  required: true
  },
  updatedAt: {
    type: Date,
  default: Date.now,
  required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: false 
  }
});

module.exports = mongoose.model('Product', products);