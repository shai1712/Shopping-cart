const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    
    userName: { 
        type: String,
        required: true,
        trim: true,
        unique: true

    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        
    },
    address: {
        type: String,
        required: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: true,
      
    }
    , email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    } ],
}, { timestamps: true }
);

userSchema.virtual('items', {
    ref: 'Item',
    localField: '_id',
    foreignField: 'userId'
})

userSchema.methods.generateAuthToken = async function()  {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "thisismyshoppingcart")
    console.log(token)
    user.tokens = user.tokens.concat({ token })
    await user.save();
    return token
}

userSchema.pre("save", async function(next)  {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


const user = mongoose.model('User', userSchema);

module.exports = user;