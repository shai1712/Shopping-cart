const express = require('express');
const Order = require('../models/order');
const User = require('../models/user');
const Item = require('../models/item');
const auth = require('../middleware/auth') 
const router = new express.Router();
const validator = require('../utils/modelsValidate')
const  definitions  = require('../utils/definitions');

router.post('/order',async (req, res) => { //create
    // const order = new Order(({
    //     userId,
    //     products,
    //     quantity,
    //     amount,


    // } = req.body))
    // console.log(order)
    // try {
    //     await order.save()
    //     return res.status(201).send({order})
    // } catch (e) {
    //     return res.status(400).send(e)
    // }
    const order = new Order(req.body)
    if (
        !validator.isValidValue(order.userId) ||
        !validator.isValidValue(order.items[0]) ||
        !validator.isValidString(order.items[0].productName) ||
        !validator.isValidString(order.items[0].quantity) ||
        !validator.isValidString(order.items[0].price) ||
        !validator.isValidString(order.beforeTax) ||
        !validator.isValidString(order.afterTax) ||
        !validator.isValidString(order.totalAmount) 
    ) { //check empty fields 
        res.status(500).send(definitions.MISSING_FIELDS);
        return;
    }
    const user = await User.findById(order.userId);
    if (!user) {
        res.status(500).send(definitions.USER_NOT_FOUND);
        return;
    }
    const product = await Item.findById(order.items[0].productId)
    if (!product) {
        res.status(500).send(definitions.ITEM_NOT_FOUND);
        return;
    }
    if (!validator.isValidPrice(order.items[0].quantity)) { //check total price is positive 
        res.status(500).send(definitions.PRICE_NOT_VALID);
        return;
    }
    if (!validator.isAvailable(order.items[0].price)) { // check price value more than 0
        res.status(500).send(definitions.PRICE_NOT_VALID);
    }
    if (!validator.isValidTotalAmount(order.totalAmount)) { // check total amount value is not negative
        res.status(500).send(definitions.TOTAL_AMOUNT_NEGATIVE);
    }
    
    
    await order.save()
    console.log(order)
    return res.status(201).send(order)
 
});
router.get('/getOneOrder/:id', async (req, res) => { //getOne
    // const order_id = req.params.id;
    // try {
    //     const order = Order.findById(order_id)
    //     if (!order) {
    //         return res.status(404).send()
    //     }
    //     return res.send(order);
    // } catch (e) {
    //     return res.status(500).send()
    // }
    if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
        return res.status(404).send(`The id ${req.params.id} of your order are not found!`);
    }
    try {
        const findOrder = await Order.findById(req.params.id);
        return res.status(200).send(findOrder);
    } catch (e) {
        return res.status(500).send();
    }
   
})
router.get('/getOrders',auth, async (req, res) => {
    console.log(req.user.id)
    const orders = await Order.find({userId: req.user.id})
    console.log(orders)
    if (orders == null || orders.length === 0) {
        return res.status(500).send(`There is no orders to show.`)
    }
        return res.status(201).send(orders) 
})
router.get('/getAllOrder', async (req, res) => {//getAll
    // const orders = await Order.find({})
    // return res.send(orders)
    const orders = await Order.find({});

        if (orders == null || orders.length === 0) {
            return res.status(500).send(`There is no orders to show.`)
        }
        return res.status(201).send(orders) 
});
router.delete('/order/:id', async (req, res) => {//delete

    const order_id = req.params.id;

    try {
        if (!(order_id.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
            return res.status(404).send({ message: 'Order not found' });
        }
        const order = await Order.findByIdAndDelete(order_id)
        if (!order) {
            return res.status(404).send('No order are found!');
        }
        return res.status(201).send(`The order ${order_id} deleted!` +'\n'+ order);
    }
        catch (e) {
            return res.status(500).send();
        }
});
router.patch('/order/:id', async (req, res) => { //update
    const orderId = req.params.id;
    // const { beforeTax, afterTax, totalAmount } = req.body;
    try {
        if (!(orderId.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
            return res.status(404).send({ message: 'Order not found' });
        }
        // const orderToUpdate = await Order.findById(orderId);
        // if (beforeTax !== orderToUpdate.beforeTax) {
        //     if (!(validator.isValidString(beforeTax))) {
        //         res.status(500).send(definitions.MISSING_FIELDS);
        //         return;
        //     } else {
        //         orderToUpdate.beforeTax = beforeTax
        //     }
          
        // }
        // if (afterTax !== orderToUpdate.afterTax) {
        //     if (!(validator.isValidString(afterTax))) {
        //         res.status(500).send(definitions.MISSING_FIELDS);
        //         return;
        //     } else {
        //         orderToUpdate.afterTax = afterTax
        //     }
          
        // }
        // if (totalAmount !== orderToUpdate.totalAmount) {
        //     if (!(validator.isValidString(totalAmount))) {
        //         res.status(500).send(definitions.MISSING_FIELDS);
        //         return;
        //     } else if (!(validator.isValidTotalAmount(totalAmount))) {
        //         res.status(500).send(definitions.TOTAL_AMOUNT_NEGATIVE);
        //         return; 
        //     } else {
        //         orderToUpdate.totalAmount = totalAmount
        //     }
          
        // }
        // Find the user by ID and update the specified fields
        // const order = await Order.findByIdAndUpdate(orderId, updatedFields, { new: true });
        await orderToUpdate.save();
        return res.send({ message: 'User updated successfully', orderToUpdate });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
      }
})


module.exports = router