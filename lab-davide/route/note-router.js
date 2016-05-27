'use strict';

const Router = require('express').Router;
const noteRouter = module.exports =  new Router();
const debug = require('debug')('note:note-router');
const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Note = require('../model/note');

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

//adding an update function to later use on my PUT request//
function updateNote(reqBody){
  debug('updateNote');
  return new Promise(function(resolve, reject){
    var id;
    try {
      id = new id(reqBody.content);
    } catch (err) {
      reject(err);
    }
    storage.fetchItem('note', id).then(function(id){
      resolve(id);
    }).catch(function(err){
      reject(err);
    });
  });
}

//adding POST request//
noteRouter.post('/', function(req, res){
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

//Adding PUT request//
noteRouter.put('/:id/edit', function(req, res){
  debug('hit endpoint /api/note PUT');
  updateNote(req.body).then(function(id){
    res.status(200).json(id);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('interal server error');
  });
});
