'use strict';
//node modules
//npm modules
//app modules
//global

//we are requiring the Router function from the express module//
const Router = require('express').Router;
const noteRouter = module.exports =  new Router();
const debug = require('debug')('note:note-router');
const JsonParser = require('body-parser').json();
const AppError = require('./../lib/app-error');
const storage = require('./../lib/storage');
const Note = require('./../model/note');


function createNote(reqBody){
  debug('createNote');
  return new Promise(function(resolve, reject){
    var note;
    try {
      note = new Note(reqBody.content);
    } catch (err) {
      reject(err);
    }
    storage.setItem('note', note).then(function(note){
      resolve(note);
    }).catch(function(err){
      reject(err);
    });
  });
}

//adding an update function to later use on PUT request//
function updateNote(data){
  debug('updateNote');
  return new Promise(function(resolve, reject){
    try {
      console.log('please work');
      storage.fetchItem('note', data.id).then(function(note){
        console.log('idiot');
        note.content = data.content;
        resolve(note);
      }).catch(function(err){
        console.log('happy');
        reject(err);
      });
    } catch (err) {
      reject(err);
    }

  });
}

//adding POST request//
noteRouter.post('/', JsonParser, function(req, res) {
  debug('hit endpoint /api/note POST');
  createNote(req.body).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('interal server error');
  });
});

//adding GET request//
noteRouter.get('/:id', function(req, res){
  debug('hit endpoint /api/note GET');
  storage.fetchItem('note', req.params.id).then(function(note){
    console.log('hello');
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('interal server error');
  });
});

//adding PUT request...look at data///
noteRouter.put('/:id', JsonParser, function(req, res){
  debug('hit endpoint /api/note/id: PUT');
  updateNote('note', req.params.id, req.body).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('interal server error');
  });
});
//inserting delete request here. Take an id, go and delete, and respond.//
noteRouter.delete('/:id', function(req, res){
  storage.deleteItem('note', req.params.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('internal server error');
  });
});
