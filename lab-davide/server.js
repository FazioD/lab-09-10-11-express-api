'use strict';
//the name space of the app in the instance below is note//

//npm modules//
const debug =require('debug')('note: server');
const express  = require('express');
const morgan = require('morgan');

//app modules//
const noteRouter = require('./route/note-router');
const errorResponse = require('./lib/error-response');
const port = process.env.PORT || 3000;
const app = express();


//enabling middle ware//
//app.use(morgan('dev'));
app.use(errorResponse);

app.use('/api/note', noteRouter);


//star represents matching all routes//
app.all('*', function(req, res) {
  debug('*404');
  res.status(404).send('not found');
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('app is up on port');
});

//we make this true so we can check this in testing//
server.isRunning = true;
module.exports = server;
