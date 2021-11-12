/* 
    ROUTE HANDLER FILE FOR LOGGING A USER IN
 */

    // dependencies
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const router = express.Router();

const { User, validateUserLogin } = require('../model/user');
const wrapper = require('../middleware/wrapper');
const bodyValidator = require('../middleware/bodyValidator');

// route handler for logging in a new user
router.post('/', bodyValidator(validateUserLogin), wrapper ( async ( req, res ) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        // the user with the email isnt available in the database
        return res.status(404).json({
            status: 404,
            message: 'invalid email or password'
        });
    } else {
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            // sent pasword doesnt match what is in the db
            return res.status(404).json({
                status: 404,
                message: 'invalid email or password'
            });
        } else {
            // login nuggets
            const token = user.generateAuthToken();
            const toReturn = _.pick(user, [ 'username', '_id', 'email' ]);

            // success response
            res.status(200).header('x-auth-token', token)
                .json({
                    status: 200,
                    message: 'success',
                    data: toReturn
                });
        }
    }
}));
    
    
module.exports = router;