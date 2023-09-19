const validator = require('validator')
const mongoose = require('mongoose')

const shoppingCartSchema = new mongoose.Schema({
    
    userId: { // user id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: { // all the products in shopping cart
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item', 
        required: true
        },
    quantity:{ //number of shopping cart
        type: Number,
        default: 1
        },
    
});

const shoppingCart = mongoose.model('shoppingCart', shoppingCartSchema);

module.exports = shoppingCart;
