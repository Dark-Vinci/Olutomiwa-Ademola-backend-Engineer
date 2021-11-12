const express = require('express');
const winston = require('winston');

const app = express();

require('./startup/logger')()
require('./startup/db')();
require('./startup/config')();
require('./startup/route')(app);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => winston.info(`listening on port ${ port }`));

module.exports = server;