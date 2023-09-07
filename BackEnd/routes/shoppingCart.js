const express = require('express');
const ShoppingCart = require('../models/shoppingCart');
const User = require('../models/user');
const Item = require('../models/item');
const router = new express.Router();
const validator = require('../utils/modelsValidate')
const  definitions  = require('../utils/definitions');

router.post('/shoppingCart',async (req, res) => { //create

    const shoppingCart = new ShoppingCart(req.body)
    console.log(shoppingCart)
    if (!validator.isValidValue(shoppingCart.userId) ||
        !validator.isValidValue(shoppingCart.productId) ||
        !validator.isValidString(shoppingCart.quantity)
    ) { //check empty fields 
        res.status(500).send(definitions.MISSING_FIELDS);
        return;
    }
    const user = await User.findById(shoppingCart.userId);
    if (!user) {
        res.status(500).send(definitions.USER_NOT_FOUND);
        return;
    }
    const product = await Item.findById(shoppingCart.productId)
    if (!product) {
        res.status(500).send(definitions.ITEM_NOT_FOUND);
        return;
    }
    if (!validator.isAvailable(shoppingCart.quantity)) { 
        res.status(500).send(definitions.QUANTITY_NOT_POSITIVE);
        return;
    }
    
    await shoppingCart.save()
    console.log(shoppingCart)
    return res.status(201).send(shoppingCart)
});
router.get('/getOneShoppingCart/:id', async (req, res) => { //getOne
    // const shoppingCart_id = req.params.id;
    // try {
    //     const shoppingCart = ShoppingCart.findById(shoppingCart_id)
    //     if (!shoppingCart) {
    //         return res.status(404).send()
    //     }
    //     return res.send(shoppingCart);
    // } catch (e) {
    //     return res.status(500).send()
    // }
    const allShoppingCart = await ShoppingCart.find({});
    let shoppingCart;
    let flag = false
    allShoppingCart.find(element => {
            if ((element._id == req.params.id)) {
                shoppingCart = element;
                flag = true
            }
        });
    if (flag) {
        return res.status(200).send(shoppingCart);
    }
    return res.status(500).send(`The id ${req.params.id} of your shoppingCart are not found!`);

})
router.get('/getAllShoppingCart', async (req, res) => {//getAll
    // const shoppingCart = await ShoppingCart.find({})
    // return res.send(shoppingCart)

    const shoppingCarts = await ShoppingCart.find({});

        if (shoppingCarts == null || shoppingCarts.length === 0) {
            return res.status(500).send(`There is no shoppingCarts to show.`)
        }
        return res.status(201).send(shoppingCarts) 
});
router.delete('/shoppingCart/:id', async (req, res) => {//delete
    // const shoppingCart_id = req.params.id;
    // try {
    //     const shoppingCart = await ShoppingCart.findByIdAndDelete(shoppingCart_id)
    //     if (!shoppingCart) {
    //         return res.status(404).send();
    //     }
    //     return res.status(201).send(`The Shopping Cart ${shoppingCart.userId} deleted!` +'\n'+ shoppingCart);
    // }
    //     catch (e) {
    //         return res.status(500).send();
    //     }
    const shoppingCart_id = req.params.id;
    
    try {
        const shoppingCart = await ShoppingCart.findByIdAndDelete(shoppingCart_id)
        if (!shoppingCart) {
            return res.status(404).send('No shoppingCart are found!');
        }
        return res.status(201).send(`The shoppingCart ${shoppingCart.userId} deleted!` +'\n'+ shoppingCart);
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