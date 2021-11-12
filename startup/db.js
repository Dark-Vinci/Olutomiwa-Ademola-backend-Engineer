// database for the app

const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
    const db = config.get('db');
    
    mongoose.connect(db, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
        .then(() => winston.info(`connected to mongodb ${ db }`))
}