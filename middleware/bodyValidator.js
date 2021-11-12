/* MIDDLEWARE FOR VALIDATING THE REQUEST BODY
 */

module.exports = function (validate) {
    return (req, res, next) => {
        const { error } = validate(req.body);

        if (error) {
            // theres error in the request body
            return res.status(400).json({
                statu: 400,
                message: error.details[0].message
            });
        } else {
            // no error, request is the passed to next middleware
            next();
        }
    }
}