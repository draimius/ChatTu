//could connect data base if wanted to (for example here just using memory)
const users = [];

// join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function getCurrentUser(id) {
  //find how writen matter else wont work
  //find return the first value that met parameter set
  return users.find((user) => user.id === id);
  //if not found return undefined
}

function userLeave(id) {
  //findIndex return the index of the first value metting paremeter set
  //can be done number of way but data aint sorted so really all be same complexity
  const index = users.findIndex((user) => user.id === id);
  //if not found will return -1
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter((user) => user.room == room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
