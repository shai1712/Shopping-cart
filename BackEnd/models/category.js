const validator = require('validator')
const mongoose = require('mongoose')
const Items = require('../models/item')

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
   
    items: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Items'
    },
   
});

const category = mongoose.model('Category', categorySchema);

module.exports = category;