const express = require('express');
const Item = require('../models/item');
const User = require('../models/item');
const router = new express.Router();
const auth = require('../middleware/auth') 
const validator = require('../utils/modelsValidate')
const  definitions  = require('../utils/definitions');
const Category = require('../models/category');

router.post('/items',auth,async (req, res) => { //create
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
        !validator.isValidString(item.title) ||
        !validator.isValidString(item.description) ||
        !validator.isValidString(item.image) ||
        !validator.isValidString(item.price) ||
        !validator.isValidValue(item.category) ||
        !validator.isValidString(item.quantity) 
    ) { //check empty fields 
        res.status(500).send(definitions.MISSING_FIELDS);
        return;
    }
    console.log(item.category)
    const category = await Category.findById(item.category)
    if (!category) {
        res.status(500).send(definitions.CATEGORY_NOT_FOUND);
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
    // console.log(item)
    return res.status(201).send({item})
    
});
router.get('/getOneItem/:id',auth, async (req, res) => { //getOne
    // const item_id = (req.params.id)

    // Item.findById(item_id).then(item => {
    //     if (!item) {
    //         return res.status(500).send(`The item ${item_id} not found!`)
    //     }
    //     return res.status(200).send(item);
    // })
    if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
        return res.status(404).send(`The item ${req.params.id} not found!`);
    }
    try {
        const findItem = await Item.findById(req.params.id);
        return res.status(200).send(findItem);
    } catch (e) {
        return res.status(500).send();
    }
})
router.get('/getAllItems', async (req, res) => {//getAll
   
    const items = await Item.find({});

        if (items == null || items.length === 0) {
            return res.status(500).send(`There is no items to show.`)
        }
        return res.status(201).send(items)        
});
router.delete('/items/:id', async (req, res) => {//delete
    const item_id = req.params.id;
    
    try {
        if (!(item_id.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
            return res.status(404).send({ message: 'Item not found' });
        }
        const item = await Item.findByIdAndDelete(item_id)
        if (!item) {
            return res.status(404).send('No items are found!');
        }
        return res.status(201).send(`The item ${item.userId} deleted!` +'\n'+ item);
    }
        catch (e) {
            return res.status(500).send();
        }
});
router.patch('/item/:id', async (req, res) => { //update
    const itemId = req.params.id;
    const { title, description, image, price, quantity } = req.body;
    try {
        if (!(itemId.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
            return res.status(404).send({ message: 'Item not found' });
        }
        const itemToUpdate = await Item.findById(itemId);

        if (title !== undefined && title !== itemToUpdate.title ) {
            if (validator.isValidString(title)) {
                itemToUpdate.title = title
            } else {
                res.status(500).send(definitions.MISSING_FIELDS);
                return;
            }
        }
        if (description !== undefined && description !== itemToUpdate.description ) {
            if (validator.isValidString(description)) {
                itemToUpdate.description = description
            } else {
                res.status(500).send(definitions.MISSING_FIELDS);
                return;
            }
        }
        if (image !== undefined && image !== itemToUpdate.image ) {
            if (validator.isValidString(image)) {
                itemToUpdate.image = image
            } else {
                res.status(500).send(definitions.MISSING_FIELDS);
                return;
            }
        }
        if (price !== undefined && price !== itemToUpdate.price) {
            if (!(validator.isValidString(price))) {
                res.status(500).send(definitions.MISSING_FIELDS);
                return;
                
            } else if (!(validator.isValidPrice(price))) {
                res.status(500).send(definitions.PRICE_NOT_VALID);
                return;
            }
            itemToUpdate.price = price

        }
        if (quantity !== undefined && quantity !== itemToUpdate.quantity) {
                if (!(validator.isValidString(quantity))) {
                    res.status(500).send(definitions.MISSING_FIELDS);
                    return;
                    
                } else if (!(validator.isAvailable(quantity))) {
                    res.status(500).send(definitions.QUANTITY_NOT_AVAILABLE);
                    return;
                }
                itemToUpdate.quantity = quantity
            }
        // Find the item by ID and update the specified fields
        // const item = await Item.findByIdAndUpdate(itemId, updatedFields, { new: true });
        await itemToUpdate.save();
        return res.send({ message: 'Item updated successfully', itemToUpdate });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
      }
})


module.exports = router