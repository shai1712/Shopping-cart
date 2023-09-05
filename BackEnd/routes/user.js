const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth') 
const bcrypt = require('bcryptjs')
const validator = require('../utils/modelsValidate')
const  definitions  = require('../utils/definitions');
//CRUD - create read update delete
router.post('/users', async (req, res) => { //create
    
    // const me = new User({
    //     userName: 'Shai1712',
    //     firstName: 'shai',
    //     lastName: 'Shais',
    //     password: 4325248,
    //     address: 'NYC22',
    //     phoneNumber: '052376545',
    //     email: 'Shai22112@gmail.com'
    // });
    const user  = new User(req.body)
    if (
        !validator.isValidString(user.userName) ||
        !validator.isValidString(user.firstName) ||
        !validator.isValidString(user.lastName) ||
        !validator.isValidString(user.password) ||
        !validator.isValidString(user.address) ||
        !validator.isValidString(user.phoneNumber) ||
        !validator.isValidString(user.email)
    ) { //check empty fields 
        res.status(500).send(definitions.MISSING_FIELDS);
        return;
    }
    if (!validator.isValidEmail(user.email)) {//check email is valid
        res.status(500).send(definitions.EMAIL_NOT_VALID);
        return;
    }
    if (!validator.isValidPhoneNumber(user.phoneNumber)) { //check phone number is contains 10 digits
        res.status(500).send(definitions.PHONE_NUMBER_NOT_VALID);
        return;
    }
    if (!validator.isValidPassword(user.password)) { // check password is more than 6 characters
        res.status(500).send(definitions.PASSWORD_NOT_VALID);
    }

    await user.save()
    console.log(user)
    return res.status(201).send({user})
});
router.post('/users/login',auth, async (req, res) => {
    const { userName, password } = req.body;
    let result;
    let message;
    
    if (userName !== "" && password !== "") {
        const user = await User.findOne({ userName })
        if (!user) {
            message = "User is not exists!"
            result = ({user})
          
        }
        else {
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                message = "Invalid password!"
                result =({ user})
               
            } else {
                message = "Login successfully!"
                const token = await user.generateAuthToken()
                result = ({user , token})
                
            }
        }
    } else {
        message = "Missing fields!"
    }
    return res.send({message,result})
})
    router.get('/getOneUser/:id', async (req, res) => { //getOne
        const user_id = req.params.id;
        try {
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).send();
            }
            return res.send(user);
        } catch (e) {
            return res.status(500).send();
        }
    });
    router.get('/getAllUsers', async (req, res) => { //getAll
        const users = await User.find({});
        try {
            return res.send(users);
        } catch (e) {
            return res.status(500).send();
        }
    });
router.delete('/users/:id', async (req, res) => { //delete
    const user_id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(user_id)
        if (!user) {
            return res.status(404).send();
        }
        return res.status(201).send(`The user ${user.userName} deleted!` +'\n'+ user);
    }
        catch (e) {
            return res.status(500).send();
        }
    });

    router.patch('/users/:id',async (req, res) => { //update
        const updates = [(req.body)];
        console.log(updates)
        const allowedUpdates = [('firstName', 'lastName', 'address', 'phoneNumber')];
        const isValidOperation = updates.every(update => {
            console.log(update)
            allowedUpdates.includes([update]);
        });
        console.log(isValidOperation)
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' });
        }
        try {
            updates.forEach((update) => (req.user[update] = req.body[update]));
            await req.user.save();
            res.send(req.user);
        } catch (e) {
            return res.status(500).send(e);
        }
    });

module.exports = router