const express = require('express');
const Item = require('../models/item');
const router = new express.Router();
const validator = require('../utils/modelsValidate')
const  definitions  = require('../utils/definitions');

router.post('/items',async (req, res) => { //create
    // const item = new Item(({
    //     userId,
    //     title,
    //     description,
    //     image,
    //     total,
    //     stock

    // } = req.body))
    
    const item = new Item(req.body)
    console.log(item)
    if (
        !validator.isValidString(item.userId) ||
        !validator.isValidString(item.title) ||
        !validator.isValidString(item.description) ||
        !validator.isValidString(item.image) ||
        !validator.isValidString(item.price) ||
        !validator.isValidString(item.category) ||
        !validator.isValidString(item.quantity) 
    ) { //check empty fields 
        res.status(500).send(definitions.MISSING_FIELDS);
        return;
    }
    if (!validator.isValidPrice(item.price)) { //check total price is positive 
        res.status(500).send(definitions.PRICE_NOT_VALID);
        return;
    }
    if (!validator.isAvailable(item.quantity)) { // check item is in stock
        res.status(500).send(definitions.QUANTITY_NOT_AVAILABLE);
    }
    
    await item.save()
    console.log(item)
    return res.status(201).send({item})
    
});
router.get('/getOneItem/:id', async (req, res) => { //getOne
    const item_id = (req.params.id)

    Item.findById(item_id).then(item => {
        if (!item) {
            return res.status(404).send('item not found!')
        }
        return res.status(200).send(item);
            
    })
    
    return res.status(500).send()
    
})
router.get('/getAllItems', async (req, res) => {//getAll
    const items = await Item.find({})
    return res.send(items)
});
router.delete('/items/:id', async (req, res) => {//delete
    const item_id = req.params.id;
    try {
        const item = await Item.findByIdAndDelete(item_id)
        if (!item) {
            return res.status(404).send();
        }
        return res.status(201).send(`The item ${item.userId} deleted!` +'\n'+ item);
    }
        catch (e) {
            return res.status(500).send();
        }
});
router.patch('/item/:id', async (req, res) => { //update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['userId','title', 'description','image','total','stock']
    const isValidOperation = updates.every((update) => {
        allowedUpdates.includes(update)
    })
    if (isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => (req.item[update] = req.body[update]))
        await req.item.save()
        res.send(req.item)
    } catch (e) {
        return res.statusMessage(500).send(e)
    }
})


module.exports = router