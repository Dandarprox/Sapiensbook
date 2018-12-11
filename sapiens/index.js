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

var service = {
    checkUserWService: {
        checkUserPort: {
            checkUser : function(args) { 
              const users = User.findOne({ name: args.name });
              return {  
                name : users.name,
                lastname : users.lastname
              } 
              
            }
        }
    }
  };
  
  var xml = require('fs').readFileSync('checkUser.wsdl', 'utf8');
  
  var server = http.createServer(function(request,response) {
      response.end("404: Not Found: "+request.url);
  });
  
  server.listen(8001);
  soap.listen(server, '/checkUser', service, xml);
  
const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));