// handles all type of route and high level middleware

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const register = require('../routes/register');
const login = require('../routes/login');
const events = require('../routes/events');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(helmet());

    if (app.get('env') == 'development') {
        app.use(morgan('tiny'));
    }
    app.use(express.json());
    app.use(compression());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/register', register);
    app.use('/api/login', login);
    app.use('/api/events', events);

    app.use(error);
}