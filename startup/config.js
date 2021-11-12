// throw error when jwt key is not defined

const config = require('config');

module.exports = function () {
    if (!config.get('jwtPass')) {
        throw new Error('FATAL ERROR, jwt key is not defined');
    }
}