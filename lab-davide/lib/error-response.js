'use strict';

const debug = require('debug')('note:error-response');
const AppError = require('./app-error');

module.exports = function (req, res,next) {
  res.SendError = function(err){
    debug('SendError');
    console.error(err.message);
    if(AppError.isAppError(err)) {
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('internal server error');
  };
  next();
};
