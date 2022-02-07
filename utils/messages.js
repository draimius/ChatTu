const moment = require('moment');
//takes input of a user name and its messages/text
function formatMessage(username, text) {
  //return them in object format
  return {
    username,
    text,
    //we add time using moment.js .format(its own funciton) and pass in how we want info (hour:minutes am/pm)
    time: moment().format('h:mm a'),
  };
}

module.exports = formatMessage;
