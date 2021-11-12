/*     MIDDLEWARE TO VALIDATE IF A CLAIMED OBJECT ID 
IS A VALID MONGOOSE ID
*/
const mongoose = require('mongoose');

module.exports = function (req, res, next) {
    const q = req.params;
    const valid = mongoose.Types.ObjectId;

    if (!valid.isValid(q.id)) {
        // invalid match
        return res.status(404).json({
            status: 404,
            message: 'not a valid object id'
        });
    } else {
        // valid id, the request is handed 
        // over to the next middleware in req, res pipeline
        next();
    }
}