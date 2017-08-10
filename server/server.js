const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const {isRealString} = require('./utils/validation');
const { Users } = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    // console.log('New user connected');

    socket.on('join', (user, callback) => {
        if (!isRealString(user.name)) {
            return callback('Name is required.');
        }
        var user = users.addUser(socket.id, user.name);
        // console.log(user);
        if (!user) {
            // console.log('same username');
            return callback('Name you have entered, already exist! Please choose different one!');
        }
        io.emit('updateUserList', users.getUserList());
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        io.emit("newUser",user.name + " has joined.");
        socket.broadcast.emit('newMessage', generateMessage('Admin', `${user.name} has joined.`));
    });
    socket.on('createMessage',(msg, callback)=>{
        // console.log('createMessage',msg);
        io.emit('newMessage', generateMessage(msg.from,msg.text));
    });
    socket.on('disconnect',()=>{
        // console.log('User is disconnected');
        var user = users.removeUser(socket.id);
        if (user) {
            io.emit('updateUserList', users.getUserList());
            io.emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
})

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
