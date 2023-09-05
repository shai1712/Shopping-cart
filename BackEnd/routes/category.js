const express = require('express');
const Category = require('../models/category');
const router = new express.Router();


router.post('/category',async (req, res) => { //create
    const category = new Category(({
        title,

    } = req.body))
    console.log(category)
    try {
        await category.save()
        return res.status(201).send({category})
    } catch (e) {
        return res.status(400).send(e)
    }
});
router.get('/getOneCategory/:title', async (req, res) => { //getOne
    const { title } = req.params;
    try {
        const categoryName = Category.findOne(title)
        if (!categoryName) {
            return res.status(404).send()
        }
        return res.send(categoryName);
    } catch (e) {
        return res.status(500).send()
    }
})
router.get('/getAllCategories', async (req, res) => {//getAll
    const categories = await Category.find({})
    return res.send(categories)
});
router.delete('/categories/:title', async (req, res) => {//delete
    const { title } = req.params;
    try {
        await req.title.remove()
        return res.send(req.title)
    } catch (e) {
        return res.status(500).send()
    }
});
router.patch('/category/:title', async (req, res) => { //update
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