const express = require('express');

const Product = require('../models/productModel.js');

let router = express.Router();


router.get('/', (req, res) => {
    Product.find({}, (err, products) => {
        res.json({ products });
    })
});

module.exports = router;
