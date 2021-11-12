/* 
    User SCHEMA, MODEL AND VALIDATING FUNCTIONS
 */

const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const Joi = require("joi");

// event object schema
const eventSchema = new Schema({
    name: {
        required: true,
        type: String,
        minlength: 2,
        maxlength: 30
    },

    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000
    },

    paid: {
        type: Boolean,
        required: true,
        default: false
    },

    price: {
        type: Number,
        min: 0,
        required: function () {
            return this.paid
        },
        default: 0
    },

    expiresIn: {
        type: Date,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Event = mongoose.model('Event', eventSchema);


// function that validate the req object for the creation of an event
function validate (input) {
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .min(2)
            .max(30),

        description: Joi.string()
            .required()
            .min(5)
            .max(1000),

        paid: Joi.boolean()
            .required(),

        price: Joi.number()
            .min(0),

        expiresIn: Joi.date()
            .required()
    });

    const result = schema.validate(input);
    return result;
}

// function that validate the req object for the editing of an event
function validateEdit (input) {
    const schema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(30),
    
        description: Joi.string()
            .min(5)
            .max(1000),

        paid: Joi.boolean(),

        price: Joi.number()
            .min(0),

        expiresIn: Joi.date()
    });

    const result = schema.validate(input);
    return result;
}

module.exports = {
    Event,
    validate,
    validateEdit
} 