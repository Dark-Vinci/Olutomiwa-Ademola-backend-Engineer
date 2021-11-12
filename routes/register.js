/* 
    REGISTERING A NEW USER 
*/

const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const router = express.Router();

const { User, validateUser } = require('../model/user');

// imported middleware
const wrapper = require('../middleware/wrapper');
const bodyValidator = require('../middleware/bodyValidator');

// route handler for registering a new user
router.post('/', bodyValidator(validateUser), wrapper ( async ( req, res ) => {
    const { email, password, firstName, lastName } = req.body;

    // check if a user with same email exists
    let user = await User.findOne({ email });
    if (user) {
        // the user exist, process should terminate
        return res.status(400).json({
            status: 400,
            message: 'a user already exist with same email'
        });
    } else {
        // no user exist with the same email
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
    
        user = new User ({
            firstName,
            lastName,
            email,
            password: hashed
        });
    
        // toreturn goodies
        await user.save();
        const token = user.generateAuthToken();
        const toReturn = _.pick(user, ['firstName', 'lastName', '_id', 'email']);
    
        // success response
        res.status(201).header('x-auth-token', token)
            .json({
                status: 201,
                message: 'success',
                data: toReturn
            });
    }
}));


module.exports = router