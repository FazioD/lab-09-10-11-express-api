'use strict';
//the name space of the app in the instance below is note//
const debug =require('debug')('note: server');
const express  = require('express');
const bodyParser = require('body-parser');

const noteRouter = require('./route/note-router');
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());



app.use('/api/note', noteRouter);

app.put('/api/note/:id', function(req, res){
    // debug('*404');?//
  res.send('update id');
});
// res.send(JSON.stringify(id))//
//star represents matching all routes//
app.all('*', function(req, res) {
  debug('*404');
  res.status(400).send('not found');
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('app is up on port');
});

//we make this true so we can check this in testing//
server.isRunning = true;
module.exports = server;
