const express = require('express');
const Order = require('../models/order');
const User = require('../models/user');
const Item = require('../models/item');
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
    console.log(order)
    console.log(order.items[0])
    console.log(order.items[0].productId)
    console.log(order.items[0].productName)
    console.log(order.items[0].quantity)
    console.log(order.items[0].price)
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
    const allOrders = await Order.find({});
    let order;
    let flag = false
    allOrders.find(element => {
            if ((element._id == req.params.id)) {
                order = element;
                flag = true
            }
        });
    if (flag) {
        return res.status(200).send(order);
    }
    return res.status(500).send(`The id ${req.params.id} of your order are not found!`);
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
    const updates = Object.keys(req.body)
    const allowedUpdates = ['userId','products','quantity']
   
    const isValidOperation = updates.every((update) => {
        allowedUpdates.includes(update)
    })
    if (isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => (req.order[update] = req.body[update]))
        await req.order.save()
        res.send(req.order)
    } catch (e) {
        return res.statusMessage(500).send(e)
    }
})


module.exports = router