const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('products', ProductSchema)

module.exports = Product;
