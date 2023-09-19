const validator = require('validator')
const mongoose = require('mongoose')
const Items = require('../models/item')

const categorySchema = new mongoose.Schema({
    title: { // name of the category
        type: String,
        required: true,
        unique: true,
        trim: true
    },
   
    items: { // the id of the products
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Items',
        required: true
    },
   
});

const category = mongoose.model('Category', categorySchema);

module.exports = category;
