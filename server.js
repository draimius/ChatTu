//anytime we do requies its like adding a libary of functionalities
const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
//inporting in sort our own libary now to server to use
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');
const botName = 'ChatTu Bot';

//capturing the structure/libary this way like a clasee with 'new' can make and use diff instances of it (variations)
const app = express();
//http libary funciton creats server with app/express libary passed in so initiate to and has all funcitonality from start
const server = http.createServer(app);
//its like layering libaries and structure of funcitonality here have previous server passed in
//-to the libary of socket.io and all that captured in var io (initialized one big bundle of libvbaries and functionality)
const io = socketio(server);

//create static folder in server (joins the curent directory with the public folder)
//this here is what give access to and from the main.js and back here so we can run the io.on with socket passed in
app.use(express.static(path.join(__dirname, 'public')));

//run when client connects
//on io (server) upon connection (socket passed in sure something with socket.io libary) assume the socket/portal do this ect..
//here we have an open bidirectional connection (open door between the client and server)
io.on('connection', (socket) => {
  //join the room
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //send event back and forth (emit)
    //this sent only to the client
    socket.emit('message', formatMessage(botName, 'welcome to chatTu'));
    //passed in message(emits event) so now can check for that in socket(on main.js)

    //broadcase when user connects
    //sent only to everyone but the cliet
    socket.broadcast
      //emiting only to specified room
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} joined the chat`)
      );

    //send user and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    //sent to everyone connected (client and all else)
    //   io.emit('message', 'connection made');

    //runs when client disconnects
    socket.on('disconnect', () => {
      //get user and remove from (in room) database
      const user = userLeave(socket.id);
      //if the user exist
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} left the chat`)
        );
        //update users in chatRoom
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });

  //listen for chatMessage (emit)
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });
});
//not completly nessesary but capture the port value/number
const PORT = process.env.PORT || 3000;
//tells server to listen at that port (front desk location) for any request
server.listen(PORT, () => console.log('server runnin on port 3000'));
//???why server and not io here io is the bundle application server also similar but no socket.io libary
