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

//server is shutting down//
after((done) => {
  if (server.isRunning){
    server.close(() => {
      server.isRunning = false;
      console.log('shuting down the server');
      done();
    });
    return;
  }
  done();
});

//Testing POST 200//
describe('testing POST /api/note', function(){
  describe('a successful post', function(){
    after((done) => {
      storage.pool = {};
      done();
    });
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
});

  //testing POST 400//
describe('testing POST with no body', function(){
  it('should return a bad request', function(done){
    request.post(baseUrl)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.text).to.equal('bad request');
        done();
      });
  });



  //testing GET 200//
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
  });

   //testing GET 404//
  describe('testing GET /api/note with an id not found', function(){
    before((done) => {
      this.tempNote = new Note('test data');
      this.tempNote.id = 8765309;
      storage.setItem('note', this.tempNote);
      done();
    });

    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return not found', (done) => {
      request.get(`${baseUrl}/${this.tempNote.id}`)
       .end(() => {
         it('should return a 404 error and not found', () => {
           expect(this.res.status).to.equal(404);
           expect(this.res.text).to.equal('not found');
         });
       });
      done();
    });
  });

  //testing GET 400//
  describe('testing GET /api/note with a bad request', function(){
    before((done) => {
      this.tempNote = new Note('test data');
      storage.setItem('note');
      done();
    });

    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return a bad request', (done) => {
      request.get(`${baseUrl}`)
       .end(() => {
         it('should return a 400 error and bad request', () => {
           expect(this.res.status).to.equal(400);
           expect(this.res.text).to.equal('bad request');
         });
       });
      done();
    });
  });

  //testing PUT 200//

describe('testing PUT /api/note', function() {
  before((done) => {
    this.tempNote = new Note('test data');
    storage.setItem('note', this.tempNote);
    done();
  });
});
// describe('testing PUT /api/note', function() {
//   before((done) => {
//     this.tempNote = new Note('test data');
//     storage.setItem('note', this.tempNote);
//     done();
//   });

  after((done) => {
    storage.pool = {};
    done();
  });
  it('should return note.id', (done) => {
    request.put(`${baseUrl}/`)
      .send(`${this.tempNote.id}`)
      .end((err, res) => {
        it('should return a 200 and a note', () => {
          expect(res.status).to.equal(200);
          expect(res.body.content).to.equal(this.tempNote.content);
          expect(res.body.id).to.equal(this.tempNote.id);
        });
      });
    done();
  });
});


  //testing PUT 400//
describe('testing PUT /api/note with a bad request', function(){
  before((done) => {
    this.tempNote = new Note('test data');
    storage.setItem('note');
    done();
  });

  after((done) => {
    storage.pool = {};
    done();
  });

  it('should return a bad request', (done) => {
    request.get(`${baseUrl}`)
       .end(() => {
         it('should return a 400 error and bad request', () => {
           expect(this.res.status).to.equal(400);
           expect(this.res.text).to.equal('bad request');
         });
       });
    done();
  });
});
