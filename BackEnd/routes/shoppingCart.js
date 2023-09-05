const express = require('express');
const ShoppingCart = require('../models/shoppingCart');
const router = new express.Router();


router.post('/shoppingCart',async (req, res) => { //create
    const shoppingCart = new ShoppingCart(({
        userId,
        products,
        quantity,


    } = req.body))
    console.log(shoppingCart)
    try {
        await shoppingCart.save()
        return res.status(201).send({shoppingCart})
    } catch (e) {
        return res.status(400).send(e)
    }
});
router.get('/getOneShoppingCart/:id', async (req, res) => { //getOne
    const shoppingCart_id = req.params.id;
    try {
        const shoppingCart = ShoppingCart.findById(shoppingCart_id)
        if (!shoppingCart) {
            return res.status(404).send()
        }
        return res.send(shoppingCart);
    } catch (e) {
        return res.status(500).send()
    }
})
router.get('/getAllShoppingCart', async (req, res) => {//getAll
    const shoppingCart = await ShoppingCart.find({})
    return res.send(shoppingCart)
});
router.delete('/shoppingCart/:id', async (req, res) => {//delete
    const shoppingCart_id = req.params.id;
    try {
        const shoppingCart = await ShoppingCart.findByIdAndDelete(shoppingCart_id)
        if (!shoppingCart) {
            return res.status(404).send();
        }
        return res.status(201).send(`The Shopping Cart ${shoppingCart.userId} deleted!` +'\n'+ shoppingCart);
    }
        catch (e) {
            return res.status(500).send();
        }
});
router.patch('/shoppingCart/:id', async (req, res) => { //update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['userId','products','quantity']
   
    const isValidOperation = updates.every((update) => {
        allowedUpdates.includes(update)
    })
    if (isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => (req.shoppingCart[update] = req.body[update]))
        await req.shoppingCart.save()
        res.send(req.shoppingCart)
    } catch (e) {
        return res.statusMessage(500).send(e)
    }
})


module.exports = router