const validator = require('validator')
const mongoose = require('mongoose')

const shoppingCartSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item', 
        required: true
        },
    quantity:{
        type: Number,
        default: 1
        },
    
});

const shoppingCart = mongoose.model('shoppingCart', shoppingCartSchema);

module.exports = shoppingCart;
