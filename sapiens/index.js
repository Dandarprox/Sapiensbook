const winston = require('winston');
const express = require('express');
const app = express();
const soap = require('soap');
const http = require('http');
const { User } = require('./models/user');



require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

app.get('/chat', function(req, res) {
  // res
});


var service = {
  checkUserWService: {
      checkUserPort: {
          checkUser : async function(args) { 
            
            console.log(".........................")
            console.log("SOAP RESPONSE")
            console.log(".........................")
            const users = await User.findOne(args);
            console.log(users.name)
            console.log(users.lastname)
            console.log(users.email)
            return {  
              name : users.name,
              lastname : users.lastname
            } 
            
          }
      }
  }
};
  
var xml = require('fs').readFileSync('checkUser.wsdl', 'utf8');

// var server = http.createServer(function(request,response) {
//     response.end("404: Not Found: " + request.url);
// });

var sticky = require('socketio-sticky-session');
 
sticky(function() {
  // This code will be executed only in slave workers
  var http = require('http');
  var server = http.createServer(function(req, res) {
    // ....
  });
  let io = require('socket.io')(server);
 
  io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
  io.set('origins', '*:*');
  
  io.on('connection', function (socket) {
    console.log('User connected');
    socket.on('disconnect', function() {
      console.log('User disconnected');
    });
    socket.on('save-message', function (data) {
      console.log(data);
      io.emit('new-message', data);
    });
  });
 
  return server;
}).listen(8002, function() {
  console.log('server started on 8002 port');
});

// server.listen(8002);
// soap.listen(server, '/checkUser', service, xml);

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));