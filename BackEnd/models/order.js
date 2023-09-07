const validator = require('validator')
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item', // Reference to the Item model
            required: true,
              },
            productName: {
                type: String,
                required: true,
                trim: true
            },
          quantity: {
            type: Number,
            required: true,
            min: 1, // Ensure the quantity is at least 1
          },
          price: {
            type: Number,
            required: true,
            min: 0, // Ensure the price is non-negative
          },
        },
    ],
    beforeTax: {
        type: Number,
        required: true,
        min: 0, // Ensure the price is non-negative
    },
    afterTax: {
        type: Number,
        required: true,
        min: 0, // Ensure the price is non-negative
    },
      totalAmount: {
        type: Number,
        required: true,
        min: 0, // Ensure the total amount is non-negative
      },
     
}, { timestamps: true });

const order = mongoose.model('order', orderSchema);

module.exports = order;
