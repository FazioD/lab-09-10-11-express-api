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
// setup globals add require modules dependent on globals//
const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api/note`;

//server is running//

describe('testing module note-router', function() {
  before((done) => {
    if (!server.isRunning) {
      server.listen(port, () => {
        // console.log('server running on port', port);
        done();
      });
      return;
    }
    done();
  });
  after((done) => {
    if (server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        // console.log('shutting down the server');
        done();
      });
      return;
    }
    done();
  });
  describe('testing POST /api/note', function(){
    after((done) => {
      storage.pool = {};
      done();
    });
    it('should return a note', function(done){
      request.post(`${baseUrl}`)
        .send({content: 'test note'})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.content).to.equal('test note');
          expect(!!res.body.id);
          done();
        });
    });
    it('should return bad request', function(done){
      request.post(`${baseUrl}`)
        .send({stuff: 'info'})
        .then(() => {
          expect(true).to.equal(false);
          done();
        })//write a test that expecitily fails//
        .catch((res) => {
          expect(res.status).to.equal(400);
          expect(res.response.res.statusMessage).to.equal('Bad Request');
          done();
        });
    });
  });
  describe('testing GET /api/note', function(){
    before((done) => {
      this.tempNote = new Note('test data');
      storage.setItem('note', this.tempNote);
      done();
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
    it('should return not found', (done) => {
      request.get(`localhost:${port}/api/fffytfuyyu6`)
      .end((res) => {
        expect(res.status).to.equal(404);
        expect(res.response.res.statusMessage).to.equal('Not Found');
        done();
      });
    });
    it('should return a bad request', (done) => {
      request.get(`${baseUrl}/gbyibiuoinno`)
      .end((res) => {
        expect(res.status).to.equal(400);
        expect(res.response.res.statusMessage).to.equal('Bad Request');
        done();
      });
    });
  });
  describe('testing PUT /api/note', function() {
    before((done) => {
      this.tempNote = new Note('test data');
      storage.setItem('note', this.tempNote);
      done();
    });
    after((done) => {
      storage.pool = {};
      done();
    });
    it('should return note', (done) => {
      request.put(`${baseUrl}/${this.tempNote.id}`).send({content: 'testupdate'})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal('testupdate');
        done();
      });
    });
    it('should return a bad request', (done) => {
      request.put(`${baseUrl}/2345`)
       .end((res) => {
         expect(res.status).to.equal(400);
         expect(res.response.res.statusMessage).to.equal('Bad Request');
         done();
       });
    });
  });
});
