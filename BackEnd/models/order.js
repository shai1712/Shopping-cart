const validator = require('validator')
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    
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
    amount: {
        type: Number,
        required: true
    }
});

const order = mongoose.model('order', orderSchema);

module.exports = order;
