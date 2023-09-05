const validator = require('validator')
const mongoose = require('mongoose')
const Orders = require('../models/order')
const Users = require('../models/user')

const shoppingCartSchema = new mongoose.Schema({
    
    userId: {
        type: String,
        required: true
    },
    products: [{
        productId: {
        type: String
        },
    quantity:{
        type: Number,
        default: 1
        },
    }],
    orders: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Orders'
    },
    User: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users'
    },
});

const shoppingCart = mongoose.model('shoppingCart', shoppingCartSchema);

module.exports = shoppingCart;
