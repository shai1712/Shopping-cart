const express = require('express');
const Order = require('../models/order');
const router = new express.Router();


router.post('/order',async (req, res) => { //create
    const order = new Order(({
        userId,
        products,
        quantity,
        amount,


    } = req.body))
    console.log(order)
    try {
        await order.save()
        return res.status(201).send({order})
    } catch (e) {
        return res.status(400).send(e)
    }
});
router.get('/getOneOrder/:id', async (req, res) => { //getOne
    const order_id = req.params.id;
    try {
        const order = Order.findById(order_id)
        if (!order) {
            return res.status(404).send()
        }
        return res.send(order);
    } catch (e) {
        return res.status(500).send()
    }
})
router.get('/getAllOrder', async (req, res) => {//getAll
    const orders = await Order.find({})
    return res.send(orders)
});
router.delete('/order/:id', async (req, res) => {//delete
    const order_id = req.params.id;
    try {
        const order = await Order.findByIdAndDelete(order_id)
        if (!order) {
            return res.status(404).send();
        }
        return res.status(201).send(`The order ${order.userId} deleted!` +'\n'+ order);
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