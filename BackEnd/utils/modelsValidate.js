const User = require('../models/user')


const isExistingUser = async ({userName}) => {
    console.log(userName)
    const existUsername = await User.findOne( userName )
   console.log(existUsername)
   
}
const isExistingEmail  = async({email}) => {
    User.findOne({ email }) ? true: false
   
}

const isValidString = (myStr) => {
    let results = false;
    if (myStr !== undefined && myStr !== '') {
        results = true;
    }
    return results;
}

const isValidValue = (val) => {
    let results = false;
    if (val !== '') {
        results = true;
    }
    return results;
}

const isValidPassword = (value) => {
    let results = false;
    if (value.length > 6) {
        results = true;
    }
    return results;
}
        
const isValidPhoneNumber = (value) => {
    let results = false;
    if (value.toString().length == 10) {
        results = true;
    }
    return results
}

const isValidPrice = (value) => {
    let results = false;
    if(value>0) {
        results = true;
    }
    return results
}
const isValidTotalAmount = (value) => {
    let results = false;
    if(value>=0) {
        results = true;
    }
    return results
}

const isValidEmail = (value) => {
    let results = false;
    const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(value.match(pattern)) {
        results = true;
    }
    return results;
}


const isAvailable = (quantity) => quantity > 0 ? true : false; 

module.exports = {isValidPhoneNumber,isValidPrice,isExistingEmail,isExistingUser,isValidTotalAmount,isValidValue, isValidEmail, isValidPassword,isAvailable, isValidString};
