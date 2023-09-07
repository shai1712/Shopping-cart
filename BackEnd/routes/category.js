const express = require('express');
const Category = require('../models/category');
const Item = require('../models/item');
const router = new express.Router();
const validator = require('../utils/modelsValidate')
const  definitions  = require('../utils/definitions');


router.post('/category',async (req, res) => { //create
     // const category = new Category(({
    //     title
    // } = req.body))
    const category = new Category(req.body)
    console.log(category)
    if (!validator.isValidString(category.title) ) { //check empty fields 
        res.status(500).send(definitions.MISSING_FIELDS);
        return;
    }
    if (!validator.isValidValue(category.items) ) { //check empty fields 
        res.status(500).send(definitions.MISSING_FIELDS);
        return;
    }
    const item = await Item.findById(category.items)
    if (!item) { //check empty fields 
        res.status(500).send(definitions.ITEM_NOT_FOUND);
        return;
    }
    
    await category.save()
    console.log(category)
    return res.status(201).send({category})
});
router.get('/getOneCategory/:id', async (req, res) => { //getOne
    // const { title } = req.params;
    // try {
    //     const categoryName = Category.findOne(title)
    //     if (!categoryName) {
    //         return res.status(404).send()
    //     }
    //     return res.send(categoryName);
    // } catch (e) {
    //     return res.status(500).send()
    // }

    const allCategory = await Category.find({});
    let category;
    let flag = false
    allCategory.find(element => {
            if ((element._id == req.params.id)) {
                category = element;
                flag = true
            }
        });
    if (flag) {
        return res.status(200).send(category);
    }
    return res.status(500).send(`The id ${req.params.id} of your category are not found!`);
})
router.get('/getAllCategories', async (req, res) => {//getAll
    // const categories = await Category.find({})
    // return res.send(categories)

    const categories = await Category.find({});

        if (categories == null || categories.length === 0) {
            return res.status(500).send(`There is no categories to show.`)
        }
        return res.status(201).send(categories) 
});
router.delete('/categories/:id', async (req, res) => {//delete

    const category_id = req.params.id;
    
    try {
        const category = await Category.findByIdAndDelete(category_id)
        if (!category) {
            return res.status(404).send('No categories are found!');
        }
        return res.status(201).send(`The category ${category.title} deleted!` +'\n'+ category);
    }
        catch (e) {
            return res.status(500).send();
        }
});
router.patch('/category/:id', async (req, res) => { //update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title']
    const isValidOperation = updates.every((update) => {
        allowedUpdates.includes(update)
    })
    if (isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => (req.category[update] = req.body[update]))
        await req.category.save()
        res.send(req.category)
    } catch (e) {
        return res.statusMessage(500).send(e)
    }
})


module.exports = router