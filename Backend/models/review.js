// review.model.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  customerEmail: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
