const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth') 
const bcrypt = require('bcryptjs')
const validator = require('../utils/modelsValidate')
const definitions = require('../utils/definitions');
const jwt = require('jsonwebtoken')
//CRUD - create read update delete


router.post('/users',auth,async (req, res) =>  {
    const user = new User(req.body);
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
    
    const { userName, email } = req.body;
    
    const isExistingUserName = await User.findOne({ userName });
    if (isExistingUserName) {
        res.status(500).send(definitions.USER_EXIST);
        return;
    }

    if (!validator.isValidEmail(user.email)) {//check email is valid
        res.status(500).send(definitions.EMAIL_NOT_VALID);
        return;
    }

    const isExistingEmail = await User.findOne({ email });
    if (isExistingEmail) {
        res.status(500).send(definitions.EMAIL_EXIST);
        return;
    }

    if (!validator.isValidPhoneNumber(user.phoneNumber)) { //check phone number is contains 10 digits
        res.status(500).send(definitions.PHONE_NUMBER_NOT_VALID);
        return;
    }

    if (!validator.isValidPassword(user.password)) { // check password is more than 6 characters
        res.status(500).send(definitions.PASSWORD_NOT_VALID);
    }
    const token = jwt.sign({ _id: user._id.toString() }, "thisismyshoppingcart")
    console.log(token)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    console.log(user)
    return res.status(201).send({user})
})
router.post('/users/login', async (req, res) => {
    const { userName, password } = req.body;
    let result;
    let message;
    
    if (userName !== "" && password !== "") {
        const user = await User.findOne({ userName })
        if (!user) {
            message = "User is not exists!"
            result = []
          
        }
        else {
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                message = "Invalid password!"
                result = []
               
            } else {
                message = "Login successfully!"
                const token = await user.generateAuthToken()
                result = ({user , token})
                
            }
        }
    } else {
        message = "Missing fields!"
        result = []
    }
    return res.send({message,result})
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        return res.status(200).send(`The user has logout successfully!!`);
    } catch (e) {
        return res.status(500).send(`Something went wrong!!`)
    }
    
})
// router.post('/users/logoutAll', auth, async (req, res) => {
//     try {
//         req.user.tokens = []
//         await req.user.save()
//         return res.send();
//     } catch (e) {
//         return res.status(500).send()
//     }
// })
router.get('/getProfileUser/:id',auth, async (req, res) => { //getOne

    if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
        return res.status(404).send(`The user ${req.params.id} not found!`);
    }
    try {
        const findUser = await User.findById(req.params.id);
        return res.status(200).send(findUser);
    } catch (e) {
        return res.status(500).send();
    }

    });
    router.get('/getAllUsers',auth, async (req, res) => { //getAll
        const users = await User.find({});
    
        if (users == null || users.length === 0) {
            return res.status(500).send(`There is no users to show.`)
        }
        return res.status(201).send(users) 
    });
router.delete('/users/:id',auth, async (req, res) => { //delete
    const user_id = req.params.id;
    try {
        if (!(user_id.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
            return res.status(404).send({ message: 'ObjectId not found' });
        }
        const user = await User.findByIdAndDelete(user_id)
        if (!user) {
            return res.status(404).send('No users are found!');
        }
        return res.status(201).send(`The user ${user.userName} deleted!` +'\n'+ user);
    }
        catch (e) {
            return res.status(500).send();
        }
    });

    router.patch('/users/:id',async (req, res) => { //update
       
        const userId = req.params.id;
        const {userName,firstname,lastName,password,address,phoneNumber,email} = req.body;
        try {
            if (!(userId.match(/^[0-9a-fA-F]{24}$/))) { //check if this a valid ObjectId
                return res.status(404).send({ message: 'User not found' });
            }

            // Find the user by ID and update the specified fields
            const userToUpdate = await User.findById(userId);
            if (userId !== userToUpdate.id) {
                if (validator.isValidValue(userId)) {
                    userToUpdate.id = userId
                }
            }
            if (userName !== userToUpdate.userName) {
          
                if (validator.isValidString(userName)) {
                    userToUpdate.userName = userName
                }else {
                    res.status(500).send(definitions.MISSING_FIELDS);
                    return;
                }
            }
            if (firstname !== undefined && firstname !== userToUpdate.first ) {
                if (validator.isValidString(firstname)) {
                    userToUpdate.firstName = firstname
                } else {
                    res.status(500).send(definitions.MISSING_FIELDS);
                    return;
                }
            }
            if (lastName !== userToUpdate.lastName) {
                if (validator.isValidString(lastName)) {
                    userToUpdate.lastName = lastName
                }else {
                    res.status(500).send(definitions.MISSING_FIELDS);
                    return;
                }
            }
          
            const isMatch = await bcrypt.compare(password, userToUpdate.password)
            if (!isMatch) {
                res.status(500).send(definitions.PASSWORD_CANNOT_CHANGE);
                return;
        }
            if (address !== userToUpdate.address) {
                if (validator.isValidString(address)) {
                    userToUpdate.address = address
                }else {
                    res.status(500).send(definitions.MISSING_FIELDS);
                    return;
                }
            }
            if (phoneNumber !== userToUpdate.phoneNumber) {
                if (!(validator.isValidString(phoneNumber))) {
                    res.status(500).send(definitions.MISSING_FIELDS);
                    return;
                }else if(!(validator.isValidPhoneNumber(phoneNumber))){
                    res.status(500).send(definitions.PHONE_NUMBER_NOT_VALID);
                    return;
                }
                userToUpdate.phoneNumber = phoneNumber
            }
            if (email !== userToUpdate.email) {
                if (!(validator.isValidString(email))) {
                    res.status(500).send(definitions.MISSING_FIELDS);
                    return;
                    
                } else if (!(validator.isValidEmail(email))) {
                    res.status(500).send(definitions.EMAIL_NOT_VALID);
                    return;
                }
                userToUpdate.email = email
            }
           
           // const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
            await userToUpdate.save();
            return res.send({ message: 'User updated successfully', userToUpdate });
            // return res.send({ message: 'User updated successfully' });
          } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Server error' });
          }
    });

module.exports = router