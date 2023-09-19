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
    if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
        return res.status(404).send(`The id ${req.params.id} of your category are not found!`);
    }
    try {
        const findCategory = await Category.findById(req.params.id);
        return res.status(200).send(findCategory);
    } catch (e) {
        return res.status(500).send();
    }
   
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
        if (!(category_id.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
            return res.status(404).send({ message: 'Category not found' });
        }
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
    const categoryId = req.params.id;
    const {title} = req.body;
    try {
        if (!(categoryId.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
            return res.status(404).send({ message: 'Category not found' });
        }
        // Find the user by ID and update the specified fields
        const categoryToUpdate = await Category.findById(categoryId);
        console.log(title)
        if (title !== undefined && title !== categoryToUpdate.title ) {
            if (validator.isValidString(title)) {
                categoryToUpdate.title = title
            } else {
                res.status(500).send(definitions.MISSING_FIELDS);
                return;
            }
        }
        await categoryToUpdate.save();
        return res.send({ message: 'Category updated successfully', categoryToUpdate });
        // const category = await Category.findByIdAndUpdate(categoryId, updatedFields, { new: true });
        // return res.send({ message: 'User updated successfully', category });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
      }
})


module.exports = router