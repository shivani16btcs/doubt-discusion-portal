const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [ isEmail, 'invalid email' ]
    },
    password: {
        type: String,
        required: true,
    },
    verificationCode: {
        type: String,
        default: ""
    },
    verified: {
        type: Boolean,
        default: false
    },
    resetPassToken: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "user"
    }
})

mongoose.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);