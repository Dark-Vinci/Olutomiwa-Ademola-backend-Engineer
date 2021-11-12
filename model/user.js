/* 
    User SCHEMA, MODEL AND VALIDATING FUNCTIONS
 */

const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
    
    // the schema for modelling the user document
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },

    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },

    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50
    },

    password: {
        type: String,
        required: true,
        maxlength: 1024
    },

    events: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Event'
    }
});
    
// instance method for generating admin authentification token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ 
        _id: this._id
    }, config.get('jwtPass'));

    return token;
}

const User = mongoose.model('User', userSchema);
    
    // function to validate the creation of a user
function validateUser (input) {
    const schema = Joi.object({
        password: Joi.string()
            .required()
            .min(7)
            .max(50),

        email: Joi.string()
            .email()
            .required(),

        firstName: Joi.string()
            .required()
            .min(2)
            .max(20),

        lastName: Joi.string()
            .required()
            .min(2)
            .max(20)
    });

    const result = schema.validate(input);
    return result;
}
    
// function to validate the loging in of user
function validateUserLogin (input) {
    const schema = Joi.object({
        password: Joi.string()
            .required()
            .min(7)
            .max(50),

        email: Joi.string()
            .email()
            .required()
    });

    const result = schema.validate(input);
    return result;
}

    
    // bult export
module.exports = {
    User,
    validateUser,
    validateUserLogin
}