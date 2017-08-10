var should = require('should');
var server = require('../server');

var options ={
  transports: ['websocket'],
  'force new connection': true
};


var io = require('socket.io-client');
var socketURL = 'http://localhost:3000';

var chatUser1 = {'name':'Una'};
var chatUser2 = {'name':'Mary'};
var chatUser3 = {'name':'Anne'};

describe("Socket connection", function () {

    it('Should join new user once it connect',function(done){
        var client = io.connect(socketURL, options);
        client.on('connect',function(data){
            client.emit('join',chatUser1);
        });

        client.on('newUser',function(usersName){
            usersName.should.be.type('string');
            usersName.should.equal(chatUser1.name + " has joined.");
            client.disconnect();
            done(); 
        });
    });

    it('Should show new user is joined to all users', function(done){
        var client1 = io.connect(socketURL, options);

        client1.on('connect', function(data){
            client1.emit('join', chatUser1);

            var client2 = io.connect(socketURL, options);

            client2.on('connect', function(data){
                client2.emit('join', chatUser2);
            });

            client2.on('newUser', function(usersName){
                usersName.should.equal(chatUser2.name + " has joined.");
                client2.disconnect();
            });
        });

        var numUsers = 0;
        client1.on('newUser', function(usersName){
            numUsers += 1;
            if(numUsers === 2){
                usersName.should.equal(chatUser2.name + " has joined.");
                client1.disconnect();
                done();
            }
        });
    });
});
