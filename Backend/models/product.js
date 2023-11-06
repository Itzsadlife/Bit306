const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    merchant_id: {type: String, required:true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: {type: String, required: true},
    price: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
