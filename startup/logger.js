// handles logging of error, information in the app to the console and the database;

const winston = require('winston');
require('winston-mongodb');
const config = require('config');

const db = config.get('db');

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.File({ filename: 'uncaughtExeptions.log'}),
        new winston.transports.Console({ prettyPrint: true, colorize: true })
    )
    
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
    
    winston.add( new winston.transports.File( { filename: 'logger.log' } ) );
    winston.add( new winston.transports.Console({ prettyPrint: true, colorize: true } ) );
    winston.add( new winston.transports.MongoDB({ 
        db: db,
        level: 'info'
    }));
}