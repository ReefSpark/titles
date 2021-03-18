var winston      = require('../app/winston');

process.on('unhandledRejection', error => {
    winston.error(error.message, error);
});
process.on('uncaughtException', error => {
    winston.error(error.message, error);
});

module.exports = process;