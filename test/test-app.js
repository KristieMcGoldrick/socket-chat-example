var expect = require('chai').expect;
var io = require('socket.io-client');
var code = require('../app');
var socketURL = 'http://localhost:3000';
var options = {
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = 'Tom';
var chatUser2 = 'Susie';

describe("Chat Server", function() {

  it("Broadcasts messages to all users using a 'chat message' emitter", function(done) {
    
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data) {
      
      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data) {
        client1.emit('chat message', 'Hello World!');
      });

      client2.on('chat message', function(msg) {
        expect(msg).to.contain('Hello World!');
        client2.disconnect();
        client1.disconnect();
        done();
      });

    });
  });

  it("Broadcasts a new user's name to all users using a 'join chat' emitter", function(done) {

    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data) {

      client1.emit('join chat', chatUser1);

      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data) {
        client2.emit('join chat', chatUser2);
      });

      client2.on('join chat', function(msg) {
        expect(msg).to.contain(chatUser2);
        client2.disconnect();
      });

    });

    var numUsers = 0;

    client1.on('join chat', function(msg) {
      numUsers += 1;

      if(numUsers === 2) {
        expect(msg).to.contain(chatUser2);
        client1.disconnect();
        done();
      }

    });
  });

  it("Removes a user from the users array on disconnect", function(done) {

    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data) {

      client1.emit('join chat', chatUser1);

      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data) {
        client2.emit('join chat', chatUser2);
      });

      client2.on('join chat', function(msg) {
        client2.disconnect();
      });

      client2.on('disconnect',function() {
        setTimeout(function() {
          expect(code.users).to.have.lengthOf(1);
        },0);
      });
    });

    var numUsers = 0;

    client1.on('join chat', function(msg) {
      numUsers += 1;

      if(numUsers === 2) {
        client1.disconnect();
        done();
      }

    });

    client1.on('disconnect', function() {
      setTimeout(function() {
        expect(code.users).to.have.lengthOf(0);
      },0);
    })
  });

  it("Broadcasts when a user is typing using a 'typing' emitter", function(done) {

    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data) {

      client1.emit('join chat', chatUser1);

      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data) {
        client1.emit('typing', chatUser1);
      });

      client2.on('typing', function(msg) {
        expect(msg).to.contain(chatUser1);
        client2.disconnect();
        client1.disconnect();
        done();
      });

    });

  });

});

