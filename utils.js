// setup utils.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// secret for securing json web tokens
const JWT_SECRET = "my-secret-phrase"


// hash password to save in database
module.exports.hashPassword = (password) => {
    const hashValue = bcrypt.hashSync(password, 8)
    return hashValue
}



// compare hashed password from db with password from request
module.exports.comparePassword = (password, hash) => {
    const correct = bcrypt.compareSync(password, hash)
    return correct
}


// Create and sign JSON web token
module.exports.getJWTToken = (account) => {
    const userData = { userId: account.id, username: account.username }
    const accessToken = jwt.sign(userData, JWT_SECRET)
    return accessToken
}

// Verify signature of JSON web token
module.exports.verifyJWT = (token) => {
    return jwt.verify(token, JWT_SECRET)
}



// get data from json web token
module.exports.decodeJWT = (token) => {
    return jwt.decode(token, JWT_SECRET)
}  