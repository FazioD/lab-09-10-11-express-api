'use strict';

// set env varibales
// require node modules
// require npm modules
const expect = require('chai').expect;
const request = require('superagent');
// require app modules
const server = require('../server');
const storage = require('../lib/storage');
const Note = require('../model/note');
// setup globals add require modules dependent on gloals
const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api/note`;

describe('testing module note-router', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server running on port', port);
        done();
      });
      return;
    }
    done();
  });
});

  after((done) => {
    if (server.isRunning){
      server.close(() => {
        server.isRunning = false;
        console.log('shutdown the server');
        done();
      });
      return;
    }
    done();
  });

//Testing POST//
  describe('testing method POST /api/note', function(){
    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return a note', function(done){
      request.post(baseUrl)
      .send({content: 'test note'})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal('test note');
        expect(!!res.body.id);
        done();
      });
    });

  describe('testing method POST with no body', function(){
    request.post(baseUrl)
    .end((err, res) => {
      expect(res.status).to.equal(400);
      expect(res.text).to.equal('bad request');
      done();
      });
    });

   it('should return \"bad request\"', () =>{
     expect(this.res.text).to.equal('\"bad request\"');
   });

   //testing GET//
  describe('testing GET /api/note', function(){
    before((done) => {
      this.tempNote = new Note('test data');
      storage.pool.note = {};
      storage.pool.note[this.tempNote.id] = this.tempNote;
      done();
    });
  });

    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return a note', (done) => {
      request.get(`${baseUrl}/${this.tempNote.id}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal(this.tempNote.content);
        expect(res.body.id).to.equal(this.tempNote.id);
        done();
      });
    });

  describe('testing method GET with no id', function(){
    after((done) => {
      storage.pool = {};
      done();
    });
  });

   it('should return a status 400', ()=> {
     expect(this.res.status).to.equal(400);
   });

   it('should return \"bad request\"', () => {
     expect(this.res.text).to.equal('\"bad request\"');
   });
