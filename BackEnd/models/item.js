const validator = require('validator')
const mongoose = require('mongoose')
const Category = require('../models/category')

const itemSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
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
    price: {
        type: Number,
        required: true,
      
    },
    category: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Category'
    },
    quantity: {
        type: Number,
        required: true,
        default: false,
    }
}, {timestamps:true});

const item = mongoose.model('Item', itemSchema);

module.exports = item;
