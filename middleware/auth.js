const jwt = require('jsonwebtoken');
const config = require('config');

// MIDDLEWARE TO AUTHENTICATE A USER
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        // no token is provided
        return res.status(401).json({
            status: 401,
            message: 'no token provided'
        });
    } else {
        try {
            // decode
            const decoded = jwt.verify(token, config.get('jwtPass'));
            
            req.user = decoded;
            next();
        } catch (ex) {
            return res.status(400).json({
                status: 400,
                message: 'invalid token is provided'
            })
        }
    }
}