const mongoose = require("mongoose");
const User = require('../models/user')
mongoose.connect("mongodb://127.0.0.1:27017/shopping-cart",
    { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
    { console.log('Successfully connected to database'); }).catch((error) => {
        console.log('Database connection failed.')
        console.error(error)
    })
    // const me = new User({
    //     name: 'Shai',
    //     email: 'Shai22112@gmail.com'
    // })
    // me.save().then(() => {
    //     console.log(me)
    // }).catch((error) => {
    //     console.log('Error!', error)
    // })