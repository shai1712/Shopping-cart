const validator = require('validator')
const mongoose = require('mongoose')
const Category = require('../models/category')

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    }
    ,
    price: { // price of the product
        type: Number,
        required: true,
      
    },
    category: { // id of the category 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    quantity: { // number of the product itself 
        type: Number,
        required: true,
        default: false,
    }
}, {timestamps:true});

const item = mongoose.model('Item', itemSchema);

module.exports = item;
