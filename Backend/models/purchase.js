const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    product: { type: String },  // Add a property to store the product name
    customerName: { type: String }, // Add a property to store the customer's name
    customerEmail: { type: String }, // Add a property to store the customer's email
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    //userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    purchaseDate: { type: Date, default: Date.now },
    price: { type: Number },
    // Other purchase-related fields
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
