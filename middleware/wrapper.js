// middleware to catch errors thrown in a route handler 
// due to the asynchronous task in the handler
module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (ex) {
            next(ex);
        }
    }
}