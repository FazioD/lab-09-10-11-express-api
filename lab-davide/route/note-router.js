'use strict';


//we are requiring the Router function from the express module//
const Router = require('express').Router;
const noteRouter = module.exports = new Router();
const debug = require('debug')('note:note-router');
const JsonParser = require('body-parser').json();
const storage = require('./../lib/storage');
const Note = require('./../model/note');
const AppError = require('./../lib/app-error');

function createNote(reqBody) {
  debug('createNote');
  return new Promise(function(resolve, reject) {
    var note;
    if(!reqBody.content) {
      var err = AppError.error400('no reqBody.content');
      return reject(err);
    }
    note = new Note(reqBody.content);
    storage.setItem('note', note).then(function(note) {
      resolve(note);
    }).catch(function(err) {
      reject(err);
    });
  });
}
//adding POST request//
noteRouter.post('/', JsonParser, function(req, res) {
  debug('hit endpoint /api/note POST');
  createNote(req.body).then(function(note) {
    res.status(200).json(note);
  }).catch(function(err) {
    res.sendError(err);
  });
});
//adding GET request//
noteRouter.get('/:id', function(req, res) {
  debug('hit endpoint /api/note GET');
  storage.fetchItem('note', req.params.id).then(function(note) {
    res.status(200).json(note);
  }).catch(function(err) {
    console.error(err.message);
    res.sendError(err);
  });
});
//adding PUT request...look at data///
noteRouter.put('/:id', JsonParser, function(req, res) {
  debug('hit endpoint /api/note/id: PUT');
  storage.updateItem('note', req.params.id, req.body).then(function(note) {
    res.status(200).json(note);
  }).catch(function(err) {
    console.error(err.message);
    res.sendError(err);
  });
});
//inserting delete request here. Take an id, go and delete, and respond.//
noteRouter.delete('/:id', function(req, res) {
  storage.deleteItem('note', req.params.id).then(function() {
    res.status(204).end();
  }).catch(function(err) {
    console.error(err.message);
    res.sendError(err);
  });
});
