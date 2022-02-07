//this is all client side
//selecting the form to work with its input
const chatForm = document.querySelector('#chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

//get username and room from URL (interesting grabbing from there and not initial submition of username and room selection)
//destructure capture (using qs cdn libary funcitons parse, location, serch, ingnorequery prefix, ect...)
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username, room);

// this is the var refrenced in the server.js io.on with socket passed in (statice folder allowed access both ways)
const socket = io();

//join chatroom
socket.emit('joinRoom', { username, room });

//get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//message from server (display)
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  //captures current event target(form) access its elements, choose one with id msg(input) then its value
  const msg = e.target.elements.msg.value;
  //sending messeage to server (1st param its key , 2nd its value)
  socket.emit('chatMessage', msg);
  //this sends chatMeddage to server.js - where in connection function io.emit(message, msg)

  //that then points back here becuase socket is this and is then read and logged with socket.on above function
  //clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//output message to dom
function outputMessage(message) {
  //means an object gets passed in with user, text, time
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span> ${message.time} </span></p>
    <p class="text">
        ${message.text}
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

//add room name to DOM
function outputRoomName(room) {
  roomName.textContent = room;
}

//add room users to DOM
function outputUsers(users) {
  //array of object with id, name, room
  // not best way to do at all but works (to clear and recreate whole list) not scale at all
  // userList.innerHTML = ' ';
  // users.forEach((element) => {
  //   let li = document.createElement('li');
  //   li.textContent = element.username;
  //   userList.appendChild(li);
  // });
  //need to create new list each iterations all together update any added or removed
  //map takes each value in array and apply whatever operation or change to each value
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join('')}
  `;
}
