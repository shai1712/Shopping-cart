const express = require('express');
const ShoppingCart = require('../models/shoppingCart');
const User = require('../models/user');
const Item = require('../models/item');
const auth = require('../middleware/auth') 
const router = new express.Router();
const validator = require('../utils/modelsValidate')
const  definitions  = require('../utils/definitions');

router.post('/shoppingCart',auth,async (req, res) => { //create

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
// router.get('/getOneShoppingCart/:id',auth, async (req, res) => { //getOne
//     // const shoppingCart_id = req.params.id;
//     // try {
//     //     const shoppingCart = ShoppingCart.findById(shoppingCart_id)
//     //     if (!shoppingCart) {
//     //         return res.status(404).send()
//     //     }
//     //     return res.send(shoppingCart);
//     // } catch (e) {
//     //     return res.status(500).send()
//     // }
//     if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
//         return res.status(404).send(`The id ${req.params.id} of your shoppingCart are not found!`);
//     }
//     try {
//         const findShoppingCart = await ShoppingCart.findById(req.params.id);
//         return res.status(200).send(findShoppingCart);
//     } catch (e) {
//         return res.status(500).send();
//     }

// })
router.get('/getShoppingCart',auth, async (req, res) =>{//getAll
    // console.log('The auth user id: ' + req.user.id)
    // return ObjectId.userId.toString() !== req.user.id;
    const shoppingCarts = await ShoppingCart.find({userId: req.user.id })
    console.log(shoppingCarts)
    if (shoppingCarts == null || shoppingCarts.length === 0) {
        return res.status(500).send(`There is no shopping carts to show.`)
    }
        return res.status(201).send(shoppingCarts) 
});
// router.get('/getAllShoppingCart',auth, async (req, res) => {//getAll
//     // const shoppingCart = await ShoppingCart.find({})
//     // return res.send(shoppingCart)

//     const shoppingCarts = await ShoppingCart.find({});

//         if (shoppingCarts == null || shoppingCarts.length === 0) {
//             return res.status(500).send(`There is no shopping carts to show.`)
//         }
//         return res.status(201).send(shoppingCarts) 
// });
router.delete('/shoppingCart/:id',auth, async (req, res) => {//delete
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
        if (!(shoppingCart_id.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
            return res.status(404).send({ message: 'Shopping cart not found' });
        }
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
router.patch('/shoppingCart/:id',auth, async (req, res) => { //update

    const shoppingCartId = req.params.id;
    const { quantity } = req.body;
    try {
        if (!(shoppingCartId.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
            return res.status(404).send({ message: 'Shopping cart not found' });
        }
        const shoppingCartToUpdate = await ShoppingCart.findById(shoppingCartId);
        // console.log(parseInt(quantity))
        // console.log(parseInt(shoppingCartToUpdate.quantity))
        if (quantity !== undefined) {
            if (!(validator.isValidString(quantity))) {
                res.status(500).send(definitions.MISSING_FIELDS);
                return;
                    
            }else if (!(validator.isAvailable(parseInt(quantity)))) {
                res.status(500).send(definitions.QUANTITY_NOT_POSITIVE);
                return;
            }
            else if (parseInt(quantity) === parseInt(shoppingCartToUpdate.quantity)) {
                res.status(500).send(`${definitions.PRICE_NOT_CHANGE} : ${quantity}`)
            }
            
            shoppingCartToUpdate.quantity = parseInt(quantity);
        }
        // Find the item by ID and update the specified fields
        // const item = await Item.findByIdAndUpdate(itemId, updatedFields, { new: true });
        await shoppingCartToUpdate.save();
        return res.send({ message: 'Shopping cart updated successfully', shoppingCartToUpdate });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
      }
})


module.exports = router